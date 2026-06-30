package hu.ibc.ibcpartners.partner.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public record PartnerDto(
        Long id,
        @NotBlank String taxNumber,
        @NotBlank String name,
        @NotBlank String headquarters,
        String site,
        String location,
        String contact,
        String phone,
        String email,
        String website,
        List<Long> activities,
        Long referralId,
        String keyWords,
        String introduction,
        String photo,
        String logo) {
}

