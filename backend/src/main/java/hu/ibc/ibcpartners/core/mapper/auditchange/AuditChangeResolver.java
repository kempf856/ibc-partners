package hu.ibc.ibcpartners.core.mapper.auditchange;

import hu.ibc.ibcpartners.core.dto.AuditChange;
import hu.ibc.ibcpartners.core.dto.AuditChangeDto;
import hu.ibc.ibcpartners.core.entity.AuditEventType;

import java.util.List;

public interface AuditChangeResolver {

    boolean supports(AuditEventType eventType);
    List<AuditChangeDto> resolveChanges(List<AuditChange> changes);
    String getFieldName(String field);

    default String formatChanges(AuditChangeDto change) {
        return getFieldName(change.field()) + ": " + nullValue(change.oldValue()) + " -> " + nullValue(change.newValue());
    }

    private String nullValue(String value) {
        return value == null ? "{ üres }" : value;
    }
}
