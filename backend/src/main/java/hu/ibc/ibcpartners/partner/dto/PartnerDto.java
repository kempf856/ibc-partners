package hu.ibc.ibcpartners.partner.dto;

import java.util.List;

public record PartnerDto(
        Long id,
        String taxNumber,
        String name,
        String headquarters,
        String site,
        String phone,
        String website,
        List<Long> activities) {
}

