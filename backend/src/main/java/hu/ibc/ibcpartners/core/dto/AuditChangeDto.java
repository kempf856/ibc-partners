package hu.ibc.ibcpartners.core.dto;

public record AuditChangeDto(
        String field,
        String oldValue,
        String newValue,
        DisplayType displayType
) {}