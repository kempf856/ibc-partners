package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.security.dto.SimplePrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String secretKey;

    @Value("${security.jwt.expiration}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(Authentication authentication) {
        JwtBuilder builder = Jwts.builder()
                .subject(authentication.getName())
                .claim("roles", authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey());
        if (authentication.getPrincipal() instanceof SimplePrincipal principal) {
                builder.claim("userId", principal.userId());
        }
        return builder.compact();
    }

    public String extractUsername(Claims claims) {
        return extractClaim(claims, Claims::getSubject);
    }

    public Long extractUserId(Claims claims) {
        return claims.get("userId", Number.class).longValue();
    }

    public Collection<? extends GrantedAuthority> extractRoles(Claims claims) {
        List<?> roles = claims.get("roles", List.class);
        return roles.stream().map(String::valueOf).map(SimpleGrantedAuthority::new).toList();
    }

    public boolean isTokenExpired(Claims claims) {
        return extractClaim(claims, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(Claims claims, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(claims);
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
