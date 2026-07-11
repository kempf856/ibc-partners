package hu.ibc.ibcpartners.partner.dto;

import java.time.Instant;

public record InvoiceDto(
        Long id,
        Long userId,
        String userName,
        Long amount,
        Instant createdAt) {
}
