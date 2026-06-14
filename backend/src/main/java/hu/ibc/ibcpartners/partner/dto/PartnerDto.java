package hu.ibc.ibcpartners.partner.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record PartnerDto(
        Long id,
        @NotBlank String taxNumber,
        @NotBlank String name,
        @NotBlank String headquarters,
        String site,
        String phone,
        String website,
        List<Long> activities,
        Long referralId,
        String keyWords,
        String introduction) {
}

