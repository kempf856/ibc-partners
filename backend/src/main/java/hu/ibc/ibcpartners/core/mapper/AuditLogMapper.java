package hu.ibc.ibcpartners.core.mapper;

import hu.ibc.ibcpartners.core.dto.AuditChange;
import hu.ibc.ibcpartners.core.dto.AuditChangeDto;
import hu.ibc.ibcpartners.core.dto.AuditLogDto;
import hu.ibc.ibcpartners.core.entity.AuditEventType;
import hu.ibc.ibcpartners.core.entity.AuditLog;
import hu.ibc.ibcpartners.core.mapper.auditchange.AuditChangeResolverRegistry;
import hu.ibc.ibcpartners.security.service.UserProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogMapper {

    private final AuditChangeResolverRegistry auditChangeResolverRegistry;
    private final UserProvider userProvider;

    public AuditLogDto map(AuditLog entity) {
        return new AuditLogDto(
                entity.getId(),
                entity.getEventType(),
                entity.getEntityType(),
                entity.getEntityId(),
                entity.getDescription(),
                entity.getBefore(),
                entity.getAfter(),
                map(entity.getChanges(), entity.getEventType()),
                entity.getCreatedBy(),
                userProvider.getName(entity.getCreatedBy()),
                entity.getCreatedAt()
        );
    }

    public List<AuditChangeDto> map(List<AuditChange> changes, AuditEventType eventType) {
        return auditChangeResolverRegistry.getResolver(eventType).resolveChanges(changes);
    }
}
