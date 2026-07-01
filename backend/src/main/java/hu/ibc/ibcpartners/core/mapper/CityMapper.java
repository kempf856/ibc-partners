package hu.ibc.ibcpartners.core.mapper;

import hu.ibc.ibcpartners.core.dto.CityDto;
import hu.ibc.ibcpartners.core.dto.SettingDto;
import hu.ibc.ibcpartners.core.entity.City;
import hu.ibc.ibcpartners.core.entity.Setting;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CityMapper {

    City map(CityDto dto);
    CityDto map(City entity);
    void map(CityDto dto, @MappingTarget City entity);
}
