package hu.ibc.ibcpartners.partner.mapper;

import hu.ibc.ibcpartners.partner.dto.ActivityDto;
import hu.ibc.ibcpartners.partner.entity.Activity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    ActivityDto map(Activity a);
    Activity map(ActivityDto dto);
    void map(ActivityDto dto, @MappingTarget Activity a);
}

