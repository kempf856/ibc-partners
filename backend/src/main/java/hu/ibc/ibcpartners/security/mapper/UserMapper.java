package hu.ibc.ibcpartners.security.mapper;

import hu.ibc.ibcpartners.security.dto.UserDto;
import hu.ibc.ibcpartners.security.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto map(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "referralCode", ignore = true)
    User map(UserDto userDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "referralCode", ignore = true)
    void map(UserDto userDto, @MappingTarget User user);
}
