package hu.ibc.ibcpartners.partner.mapper;

import hu.ibc.ibcpartners.partner.dto.PartnerDto;
import hu.ibc.ibcpartners.partner.entity.Partner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PartnerMapper {

    @Mapping(target = "id", ignore = true)
    Partner map(PartnerDto dto);
    PartnerDto map(Partner partner);

    @Mapping(target = "id", ignore = true)
    void map(PartnerDto dto, @MappingTarget Partner partner);
}
