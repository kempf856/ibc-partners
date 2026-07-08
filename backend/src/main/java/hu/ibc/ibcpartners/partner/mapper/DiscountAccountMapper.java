package hu.ibc.ibcpartners.partner.mapper;

import hu.ibc.ibcpartners.partner.dto.DiscountAccountDto;
import hu.ibc.ibcpartners.partner.entity.DiscountAccount;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DiscountAccountMapper {

    DiscountAccountDto map(DiscountAccount entity);
}
