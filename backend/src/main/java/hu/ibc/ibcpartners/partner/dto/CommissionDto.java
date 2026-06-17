package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.partner.entity.CommissionStatus;

import java.time.LocalDate;

public record CommissionDto(
        Long id,
        Long transactionId,
        Long userId,
        String userName,
        String sellerName,
        String description,
        LocalDate fulfillmentDate,
        Long amount,
        Long commission,
        CommissionStatus status) {
}
