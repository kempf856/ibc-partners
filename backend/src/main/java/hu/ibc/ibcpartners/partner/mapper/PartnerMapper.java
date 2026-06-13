package hu.ibc.ibcpartners.partner.mapper;

import hu.ibc.ibcpartners.partner.dto.PartnerDto;
import hu.ibc.ibcpartners.partner.entity.Partner;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PartnerMapper {

    Partner map(PartnerDto dto);
    PartnerDto map(Partner partner);
    void map(PartnerDto dto, @MappingTarget Partner partner);
}

