package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.security.dto.UserDto;
import hu.ibc.ibcpartners.security.entity.Role;
import hu.ibc.ibcpartners.security.entity.User;
import hu.ibc.ibcpartners.security.mapper.UserMapper;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @PostConstruct
    public void initUsers() {
        createDefaultUser();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public PageResponse<UserDto> search(String email, String fullName, Role role, Pageable pageable) {
        return PageResponse.of(userRepository.search(email, fullName, role == null ? null : role.name(), pageable), userMapper::map);
    }

    private void createDefaultUser() {
        String defaultUser = "admin@gmail.com";
        if (userRepository.findByEmail(defaultUser).isPresent()) {
            return;
        }

        User user = User.builder()
                .email(defaultUser)
                .password(passwordEncoder.encode("adminpass123"))
                .fullName("Default Direktor")
                .roles(List.of(Role.ADMIN, Role.PARTNER))
                .build();
        userRepository.save(user);
    }
}