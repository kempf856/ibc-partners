# AGENTS.md - IBC Partners Codebase Guide for AI Coding Agents

## Architecture Overview

This is a **full-stack partner management application** with clear separation:
- **Backend**: Spring Boot 3.5.14 (Java 21) REST API with PostgreSQL
- **Frontend**: Angular 21 (standalone components) with Material Design
- **Local Dev**: Docker Compose PostgreSQL on port 5444

**Critical Flow**: Frontend proxy routes `/api/*` requests to backend on `http://localhost:8080`. Both frontend and backend run independently—do NOT couple deployment decisions.

## Technology Stack & Tooling

### Backend (Gradle-based)
```
- Spring Boot 3.5.14 with Spring Security (JWT-based)
- JPA/Hibernate + Flyway migrations (PostgreSQL 16)
- MapStruct (entity ↔ DTO mapping) + Lombok (boilerplate elimination)
- JJWT 0.13.0 (JWT generation/validation)
- SpringDoc OpenAPI (Swagger @ `/swagger-ui.html`)
- Spring Mail + Thymeleaf (email templates in src/main/resources/templates/email/)
```

**Build Commands**:
```bash
./gradlew :backend:build          # Full build
./gradlew :backend:bootJar        # Prod JAR
./gradlew :backend:test           # JUnit 5 tests (H2 in-memory DB)
```

### Frontend (npm + Angular CLI 21)
```
- Angular 21 (standalone components, no NgModules)
- Angular Material 21 + CDK (paginator with Hungarian locale)
- RxJS for reactive patterns
- Vitest for unit tests + jsdom
```

**Build Commands**:
```bash
cd frontend
npm install
npm start                          # Dev server @ localhost:4200 (proxy to :8080)
npm run build                      # Production build (dist/)
npm test                           # Vitest
```

**Dev Proxy**: `frontend/proxy.conf.json` routes `/api/*` → `http://localhost:8080`.

## Key Architectural Patterns

### Backend: Service → Repository → Entity Layer
```
hu.ibc.ibcpartners/
├── config/           # Security, JWT filter, Swagger, global exception handler
├── security/         # Auth logic: AuthService, UserService, JwtService, SecurityAuditorAware
├── common/           # Shared DTOs (PageResponse), base entities
├── dashboard/        # Feature module: Applications & workflow logic
└── notification/     # Email handling (feature module)
```

**Why this matters**: Adding new features requires:
1. New entity in `backend/src/main/java/hu/ibc/ibcpartners/{featureName}/entity/`
2. Repository interface extending `JpaRepository`
3. Service with business logic
4. Controller under `:featureName/controller/`

### Frontend: Feature-Based with Core Services
```
src/app/
├── core/              # Singleton services (AuthService, NotificationService)
├── features/          # Feature modules (auth, dashboard) - each has own routing
├── shared/            # Utilities (role.ts, pagination response type)
└── app.config.ts      # Global HTTP interceptor + auth config
```

**Key Pattern**: All HTTP requests automatically get `Authorization: Bearer {token}` via `authInterceptor`. Auth errors (401) trigger logout.

### Authentication & Authorization

**JWT Payload** (JJWT):
```json
{
  "sub": "username",
  "roles": ["ADMIN", "PARTNER", "SALES"],
  "exp": <timestamp_ms>
}
```

**Backend**: `JwtAuthenticationFilter` → `UsernamePasswordAuthenticationToken` + `SimplePrincipal` (custom UserDetails)

**Frontend**: `AuthService` decodes JWT on login, stores in localStorage as `myIBCtoken`. Routes protected by `authGuard` (checks expiry) and `roleGuard` (checks roles from JWT).

**CRITICAL**: Roles are derived from JWT claims, NOT database queries on every request (stateless).

### Database Auditing
All entities have `created_at`, `created_by`, `modified_at`, `modified_by`. Backend uses `@EnableJpaAuditing` + `SecurityAuditorAware` to auto-populate creator/modifier from `SecurityContext`.

**Migrations**: Flyway scripts in `backend/src/main/resources/db/migration/`. Always create new `VXX__<description>.sql` file—never modify existing ones.

## Database Schema Overview

```sql
-- applications: Partner applications with workflow states
state IN ('CREATED', 'IN_PROGRESS', 'ACCEPTED', 'DENIED')
sales_id REFERENCES users(id)  -- Sales person assigned to review

-- users: System users + referral system
roles TEXT[] CHECK (roles <@ ARRAY['ADMIN', 'PARTNER', 'SALES'])
referral_id REFERENCES users(id)  -- Referral tree
one_time_password UUID  -- For registration flow
```

**Why important**: Change workflow states via enum validation; use `referral_id` for partner hierarchy.

## Critical Developer Workflows

### Starting Backend Dev
```bash
# Ensure PostgreSQL running
docker-compose up -d

# Run Spring Boot (watches for changes)
./gradlew :backend:bootRun

# Swagger docs available @ http://localhost:8080/swagger-ui.html
```

### Starting Frontend Dev
```bash
cd frontend
npm start
# Navigates to http://localhost:4200
# Proxy rule in proxy.conf.json handles API calls → localhost:8080
```

### Adding a New API Endpoint
1. **Create Entity** (MapStruct will need mapper): `backend/src/main/java/hu/ibc/ibcpartners/{featureName}/entity/MyEntity.java`
2. **Create Repository**: Extends `JpaRepository<MyEntity, Integer>`
3. **Create Service**: Business logic layer
4. **Create Controller**: Add `@RestController`, `@RequestMapping("/api/{feature}")`, use `@PreAuthorize` for role checks
5. **Create DTOs**: Separate request/response DTOs (MapStruct mapper)
6. **Create Frontend Service**: `frontend/src/app/features/{featureName}/service/my.service.ts`
7. **Create Frontend Component**: Use dependency injection for service

**Why**: This layering ensures:
- Database queries isolated in repository
- Business logic testable (unit test against mocked repository)
- HTTP serialization concerns separate (DTO layer)
- Frontend services follow Angular style guide (providedIn: 'root')

### Database Migration Workflow
```bash
# After schema changes:
# 1. Create new migration file: backend/src/main/resources/db/migration/V003__<description>.sql
# 2. Spring Boot auto-runs on startup (Flyway baseline-on-migrate: true)
# 3. Never touch existing V*.sql files (breaks migrations for other environments)
```

### Email Template Updates
- **Location**: `backend/src/main/resources/templates/email/`
- **Format**: Thymeleaf (`.html`)
- **Usage**: Injected into `MailService` via Spring and sent with `JavaMailSender`
- **Variables**: Passed as model attributes (e.g., `[[${otp}]]`)

## Build & Deployment

### Docker Images
```bash
# Backend: ghcr.io/kempf856/ibcpartners-backend:latest
# Frontend: ghcr.io/kempf856/ibcpartners-frontend:latest
# See: build.sh script (bash, not PowerShell)
```

### Production Deployment
- Backend JAR bundled in `backend/Dockerfile` (runs on port 8080)
- Frontend artifacts in `frontend/nginx.conf` (serves static + proxies `/api/*` to backend)
- **Never hardcode**—use environment variables (see `application.yaml` syntax: `${VAR_NAME:default}`)

**Key Env Vars**:
```
SPRING_DATASOURCE_URL           # Production PostgreSQL connection
SPRING_DATASOURCE_USERNAME      # DB user
SPRING_DATASOURCE_PASSWORD      # DB password
SECURITY_JWT_SECRET             # JWT signing key (HIGH SECURITY)
APP_FRONTEND_URL                # CORS origin
APP_ADMIN_EMAIL                 # Bootstrap admin creation
MAIL_SENDER_* + MAIL_PASSWORD   # Email credentials
```

## Exception Handling & Response Format

**Backend**: `GlobalExceptionHandler` catches all exceptions → `ResponseStatusException` with HTTP status. Client receives JSON with `detail` field (used by frontend error handler).

**Frontend**: `authInterceptor` catches API errors:
- **401 Unauthorized** → Auto logout
- **All errors** → Show notification via `NotificationService`

**Pattern**: Always catch errors in interceptor, NOT in component—global error handling ensures consistency.

## Testing

- **Backend**: Vitest for unit tests (not integrated into build yet, check later)
- **Frontend**: JUnit 5 with H2 in-memory DB (testImplementation 'com.h2database:h2')
- **No E2E tests configured**—good opportunity to add Cypress or Playwright

## Important File References

| File | Purpose | Edit When |
|------|---------|-----------|
| `settings.gradle` | Declares `backend` module | Adding new Gradle submodules |
| `backend/build.gradle` | Backend dependencies + Java 21 config | Adding new library or version bumps |
| `backend/src/main/resources/application.yaml` | Backend config (datasource, JWT, mail) | Configuring new environment variables |
| `backend/src/main/resources/db/migration/V*.sql` | Database schema | Schema changes (CREATE/ALTER TABLE) |
| `frontend/src/app/app.config.ts` | HTTP interceptor + global providers | Adding auth logic or new HTTP interceptors |
| `frontend/src/app/app.routes.ts` | Frontend routing + role-based guards | Adding new pages or changing route guards |
| `docker-compose.yaml` | Local dev database | Database port/credentials changes |
| `build.sh` | Docker build & push | Changing registry or image names |

## Conventions & Anti-Patterns

✅ **DO**:
- Use `@PreAuthorize("hasRole('ADMIN')")` for endpoint protection
- Place DTOs in same package as entity (e.g., `user.entity.UserCreateRequest`)
- Inject services via constructor in components (`constructor(private svc: MyService)`)
- Use standalone components in Angular (no `CommonModule` imports)
- Store complex state in `ApplicationState` service (frontend)

❌ **DON'T**:
- Query database multiple times in service method (use repository joins)
- Expose entity objects as API responses (use DTOs + MapStruct)
- Hard-code API URLs in components (inject `AuthService.baseUrl` or use environment config)
- Modify existing Flyway migration files (create new V*.sql instead)
- Add business logic directly in controllers (belongs in service layer)

## Stateless Auth Design Goal

Key insight: JWT + SecurityContext means **NO SESSION STATE ON BACKEND**. Each request authenticates via JWT token in header. This enables:
- Horizontal scaling (no sticky sessions)
- Microservices-ready (token passed between services)
- SPA-friendly (no CSRF concerns with stateless JWT)

**Implication for agents**: When adding auth-protected features, always use `@PreAuthorize` + extract user ID from `SecurityContext`, not session.

## Quick Debugging Checklist

| Issue | Check |
|-------|-------|
| Frontend can't reach backend | `proxy.conf.json` has correct target; backend running on :8080 |
| JWT validation fails | Token in `Authorization: Bearer <token>` header; `SECURITY_JWT_SECRET` matches on backend |
| 401 Unauthorized logged-out user | `JwtAuthenticationFilter` extracting claims; token not expired |
| Email not sending | SMTP credentials in `application.yaml`; Thymeleaf template file exists |
| Database migration failed | Check for syntax errors in new `V*.sql`; Flyway baseline-on-migrate enabled |
| Build fails with Lombok/MapStruct | Ensure `annotationProcessor` dependencies in `build.gradle` |

