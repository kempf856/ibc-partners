package hu.ibc.ibcpartners.core.mapper;

import hu.ibc.ibcpartners.core.dto.CommissionSettingDto;
import hu.ibc.ibcpartners.core.dto.SettingDto;
import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.entity.Setting;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CommissionSettingMapper {

    CommissionSetting map(CommissionSettingDto dto);
    CommissionSettingDto map(CommissionSetting setting);
    void map(CommissionSettingDto dto, @MappingTarget CommissionSetting setting);
}
