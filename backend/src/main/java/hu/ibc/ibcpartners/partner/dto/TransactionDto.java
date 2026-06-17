package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.partner.entity.TransactionStatus;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDate;

public record TransactionDto(
        Long id,
        @NotNull Long sellerId,
        String sellerName,
        @NotNull Long buyerId,
        String buyerName,
        String invoiceNumber,
        @NotNull Long amount,
        String description,
        LocalDate fulfillmentDate,
        Instant sellerApproved,
        Instant buyerApproved,
        TransactionStatus status
) {
}
