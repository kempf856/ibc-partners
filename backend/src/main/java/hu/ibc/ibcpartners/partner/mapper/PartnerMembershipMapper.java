package hu.ibc.ibcpartners.partner.mapper;

import hu.ibc.ibcpartners.partner.dto.PartnerMembershipDto;
import hu.ibc.ibcpartners.partner.entity.PartnerMembership;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PartnerMembershipMapper {

    PartnerMembership map(PartnerMembershipDto dto);
    PartnerMembershipDto map(PartnerMembership membership);
}
