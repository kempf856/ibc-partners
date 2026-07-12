package hu.ibc.ibcpartners.core.mapper.auditchange;

import hu.ibc.ibcpartners.core.entity.AuditEventType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AuditChangeResolverRegistry {

    private final List<AuditChangeResolver> resolvers;

    public AuditChangeResolver getResolver(AuditEventType eventType) {
        return resolvers.stream().filter(r -> r.supports(eventType)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Audit napló nem értelmezhető!"));
    }
}
