package hu.ibc.ibcpartners.core.mapper;

import hu.ibc.ibcpartners.core.dto.SettingDto;
import hu.ibc.ibcpartners.core.entity.Setting;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SettingMapper {

    Setting map(SettingDto dto);
    SettingDto map(Setting setting);
    void map(SettingDto dto, @MappingTarget Setting setting);
}
