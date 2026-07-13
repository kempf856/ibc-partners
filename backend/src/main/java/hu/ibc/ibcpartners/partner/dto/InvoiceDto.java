package hu.ibc.ibcpartners.partner.dto;

import java.time.Instant;
import java.util.List;

public record InvoiceDto(
        Long id,
        Long userId,
        String userName,
        Long amount,
        Instant createdAt,
        List<CommissionDto> commissions) {
}
