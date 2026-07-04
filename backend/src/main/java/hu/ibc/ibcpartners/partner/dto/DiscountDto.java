package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.partner.entity.DiscountStatus;

import java.time.LocalDate;

public record DiscountDto(
        Long id,
        Long sellerId,
        Long buyerId,
        Long transactionId,
        String sellerName,
        String buyerName,
        String description,
        LocalDate fulfillmentDate,
        Long amount,
        Long discount,
        DiscountStatus status) {
}
