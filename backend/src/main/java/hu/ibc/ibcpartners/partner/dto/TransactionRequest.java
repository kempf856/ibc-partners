package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.partner.entity.TransactionStatus;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDate;

public record TransactionRequest(
        Long id,
        @NotNull Long sellerId,
        @NotNull Long buyerId,
        String invoiceNumber,
        @NotNull Long amount,
        String description,
        LocalDate fulfillmentDate
) {
}
