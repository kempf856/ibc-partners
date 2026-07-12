package hu.ibc.ibcpartners.core.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record AuditChange(
        String field,
        JsonNode oldValue,
        JsonNode newValue
) {}