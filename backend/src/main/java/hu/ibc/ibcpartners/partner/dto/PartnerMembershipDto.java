package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.partner.entity.PartnerMembershipRole;

public record PartnerMembershipDto(Long id, Long userId, String userName, Long partnerId, String partnerName, PartnerMembershipRole role) {
}
