package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.notification.service.EmailService;
import hu.ibc.ibcpartners.notification.service.EmailTemplate;
import hu.ibc.ibcpartners.security.dto.OtpRequest;
import hu.ibc.ibcpartners.security.dto.UserDto;
import hu.ibc.ibcpartners.security.entity.Role;
import hu.ibc.ibcpartners.security.entity.User;
import hu.ibc.ibcpartners.security.mapper.UserMapper;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

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

    public void create(UserDto userDto) {
        User user = userMapper.map(userDto);
        user.setId(null);

        userRepository.save(user);
        handleForgotPassword(userDto.email(), EmailTemplate.REGISTRATION);
    }

    @Transactional
    public void register(OtpRequest otpRequest) {
        User user = userRepository.findByOneTimePassword(otpRequest.otp())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Felhasználó nem található ezzel a kóddal: " + otpRequest.otp()));

        user.setPassword(passwordEncoder.encode(otpRequest.password()));
        user.setOneTimePassword(null);
    }

    public void handleForgotPassword(String email, EmailTemplate template) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return;
        }

        UUID oneTimePassword = UUID.randomUUID();
        user.get().setOneTimePassword(oneTimePassword);
        userRepository.save(user.get());

        String link = frontendUrl + "/register?otp=" + oneTimePassword;
        emailService.sendEmail(email, template, Map.of("name", user.get().getFullName(), "link", link));
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