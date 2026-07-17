package hu.ibc.ibcpartners.dashboard.mapper;

import hu.ibc.ibcpartners.dashboard.dto.SlideDto;
import hu.ibc.ibcpartners.dashboard.entity.Slide;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SlideMapper {
    SlideDto map(Slide entity);
    @Mapping(target = "id", ignore = true)
    Slide map(SlideDto dto);
    void map(SlideDto dto, @MappingTarget Slide entity);
}

