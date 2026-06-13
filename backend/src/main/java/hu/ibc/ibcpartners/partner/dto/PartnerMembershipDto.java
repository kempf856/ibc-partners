package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.partner.entity.PartnerMembershipRole;

public record PartnerMembershipDto(Long id, Long userId, Long partnerId, PartnerMembershipRole role) {
}
