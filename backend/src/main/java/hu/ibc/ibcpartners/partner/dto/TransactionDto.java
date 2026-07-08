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
        @NotNull Long discount,
        String description,
        LocalDate fulfillmentDate,
        Instant sellerApproved,
        Integer sellerApprover,
        String sellerApproverName,
        Instant buyerApproved,
        Integer buyerApprover,
        String buyerApproverName,
        TransactionStatus status,
        Instant createdAt,
        Instant modifiedAt
) {
}
