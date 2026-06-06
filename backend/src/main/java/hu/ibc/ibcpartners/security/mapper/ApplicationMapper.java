package hu.ibc.ibcpartners.security.mapper;

import hu.ibc.ibcpartners.security.dto.ApplicationDto;
import hu.ibc.ibcpartners.security.dto.ApplicationRequest;
import hu.ibc.ibcpartners.security.dto.UserDto;
import hu.ibc.ibcpartners.security.entity.Application;
import hu.ibc.ibcpartners.security.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {

    Application map(ApplicationRequest applicationRequest);
    ApplicationDto map(Application application);
    ApplicationDto map(Application application, String salesName);
}
