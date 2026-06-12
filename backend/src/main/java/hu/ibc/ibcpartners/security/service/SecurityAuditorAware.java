package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.security.dto.SimplePrincipal;
import jakarta.annotation.Nonnull;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityAuditorAware implements AuditorAware<Long> {

    @Override
    @Nonnull
    public Optional<Long> getCurrentAuditor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof SimplePrincipal principal) {
            return Optional.of(principal.userId());
        }

        return Optional.empty();
    }
}