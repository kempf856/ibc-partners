package hu.ibc.ibcpartners.core.dto;

import jakarta.validation.constraints.NotNull;

public record CommissionSettingDto(
        @NotNull Long id,
        Long partnerId,
        Long transactionId,
        @NotNull Integer sellerPercent,
        Integer buyerPercent,
        Long director1Id,
        Integer director1Percent,
        Long director2Id,
        Integer director2Percent,
        Long director3Id,
        Integer director3Percent,
        Long referralId,
        Integer referralPercent) {
}
