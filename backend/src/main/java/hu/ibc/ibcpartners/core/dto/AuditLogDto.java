package hu.ibc.ibcpartners.core.dto;

import com.fasterxml.jackson.databind.JsonNode;
import hu.ibc.ibcpartners.core.entity.AuditEventType;

import java.time.Instant;
import java.util.List;

public record AuditLogDto(
        Long id,
        AuditEventType eventType,
        String entityType,
        Long entityId,
        String description,
        JsonNode before,
        JsonNode after,
        List<AuditChangeDto> changes,
        Long createdBy,
        String createdByName,
        Instant createdAt) {
}
