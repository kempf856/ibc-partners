package hu.ibc.ibcpartners.core.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hu.ibc.ibcpartners.core.dto.AuditChange;
import hu.ibc.ibcpartners.core.dto.AuditLogDto;
import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.entity.AuditEventType;
import hu.ibc.ibcpartners.core.entity.AuditLog;
import hu.ibc.ibcpartners.core.mapper.AuditLogMapper;
import hu.ibc.ibcpartners.core.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;
    private final ObjectMapper objectMapper;

    public PageResponse<AuditLogDto> search(Pageable pageable) {
        return PageResponse.of(auditLogRepository.findAll(pageable), auditLogMapper::map);
    }

    public void write(AuditEventType eventType, Object before, Object after, String description) {
        JsonNode beforeJson = objectMapper.valueToTree(before);
        JsonNode afterJson = objectMapper.valueToTree(after);

        List<AuditChange> changes = createChanges(beforeJson, afterJson);
        if (changes.isEmpty()) {
            return;
        }

        AuditLog auditLog = AuditLog.builder()
                .eventType(eventType)
                .entityType(before != null ? before.getClass().getSimpleName() : after.getClass().getSimpleName())
                .entityId(before != null ? beforeJson.get("id").asLong() : afterJson.get("id").asLong())
                .description(description)
                .before(beforeJson)
                .after(afterJson)
                .changes(changes)
                .build();
        auditLogRepository.save(auditLog);
    }

    public List<AuditChange> createChanges(Object before, Object after) {
        return createChanges(objectMapper.valueToTree(before), objectMapper.valueToTree(after));
    }

    private List<AuditChange> createChanges(JsonNode before, JsonNode after) {
        List<AuditChange> changes = new ArrayList<>();
        Iterator<String> fields = before != null ? before.fieldNames() : after.fieldNames();

        while (fields.hasNext()) {
            String field = fields.next();

            JsonNode oldValue = before != null ? before.get(field) : null;
            JsonNode newValue = after.get(field);

            if (!Objects.equals(oldValue, newValue)) {
                changes.add(new AuditChange(field, oldValue, newValue));
            }
        }

        return changes;
    }
}
