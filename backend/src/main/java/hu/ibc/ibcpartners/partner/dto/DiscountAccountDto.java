package hu.ibc.ibcpartners.partner.dto;

public record DiscountAccountDto(
        Long id,
        Long sellerId,
        Long buyerId,
        String sellerName,
        String buyerName,
        Long allDiscounts,
        Long availableBalance,
        Long blockedBalance) {
}
