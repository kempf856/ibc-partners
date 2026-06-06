package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.security.dto.SimplePrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

public class AuthHelper {

    public static Long getUserId() {
        if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof SimplePrincipal principal) {
            return principal.userId();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nincs bejelentkezett felhasználó!");
    }
}
