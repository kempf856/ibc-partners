package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.security.dto.UserDto;
import hu.ibc.ibcpartners.security.entity.User;
import hu.ibc.ibcpartners.security.mapper.UserMapper;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class UserProvider {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private Map<Long, UserDto> map;

    public Map<Long, UserDto> getAll() {
        if (map == null) {
            reset();
        }
        return map;
    }

    public void reset() {
        map = userRepository.findAll().stream().collect(Collectors.toMap(User::getId, userMapper::map));
    }

    public String getName(Long userId) {
        if (userId == null) {
            return null;
        }

        return getAll().get(userId).fullName();
    }

    public String getEmail(Long userId) {
        if (userId == null) {
            return null;
        }

        return getAll().get(userId).email();
    }

}
