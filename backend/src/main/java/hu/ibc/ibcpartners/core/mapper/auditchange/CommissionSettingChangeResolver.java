package hu.ibc.ibcpartners.core.mapper.auditchange;

import com.fasterxml.jackson.databind.JsonNode;
import hu.ibc.ibcpartners.core.dto.AuditChange;
import hu.ibc.ibcpartners.core.dto.AuditChangeDto;
import hu.ibc.ibcpartners.core.dto.DisplayType;
import hu.ibc.ibcpartners.core.entity.AuditEventType;
import hu.ibc.ibcpartners.security.service.UserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CommissionSettingChangeResolver implements AuditChangeResolver {

    private static final Map<String, String> FIELDS = Map.of(
            "sellerPercent", "Partneri jutalék",
            "buyerPercent", "Vevő kedvezmény",
            "director1Id", "Direktor 1",
            "director1Percent", "Direktor 1 jutalék",
            "director2Id", "Direktor 2",
            "director2Percent", "Direktor 2 jutalék",
            "director3Id", "Direktor 3",
            "director3Percent", "Direktor 3 jutalék",
            "referralId", "Üzletkötő",
            "referralPercent", "Üzletkötői jutalék"
    );

    private final UserProvider userProvider;

    @Override
    public boolean supports(AuditEventType eventType) {
        return eventType == AuditEventType.COMMISSION_SETTING_CHANGED;
    }

    @Override
    public List<AuditChangeDto> resolveChanges(List<AuditChange> changes) {
        return changes.stream().map(c -> {
            DisplayType displayType = switch (c.field()) {
                case "director1Id", "director2Id", "director3Id", "referralId" -> DisplayType.STRING;
                default -> DisplayType.INTEGER;
            };
            return new AuditChangeDto(c.field(), resolveUser(c.oldValue(), c.field()), resolveUser(c.newValue(), c.field()), displayType);
        }).toList();
    }

    @Override
    public String getFieldName(String field) {
        return FIELDS.getOrDefault(field, field);
    }

    private String resolveUser(JsonNode value, String field) {
        if (value == null || value.isNull()) {
            return null;
        }

        return switch (field) {
            case "director1Id", "director2Id", "director3Id", "referralId" -> userProvider.getName(value.asLong());
            default -> value.asText();
        };
    }
}
