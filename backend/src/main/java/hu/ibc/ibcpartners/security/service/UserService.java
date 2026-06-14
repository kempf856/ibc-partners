package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.notification.service.EmailService;
import hu.ibc.ibcpartners.notification.service.EmailTemplate;
import hu.ibc.ibcpartners.security.dto.OtpRequest;
import hu.ibc.ibcpartners.security.dto.SimplePrincipal;
import hu.ibc.ibcpartners.security.dto.UserDto;
import hu.ibc.ibcpartners.security.entity.Role;
import hu.ibc.ibcpartners.security.entity.User;
import hu.ibc.ibcpartners.security.mapper.UserMapper;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
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

    @Value("${app.bootstrap-admin-email}")
    private String adminEmail;

    public UserDto getLoggedInUser() {
        Long userId = AuthHelper.getUserId();
        return userRepository.findById(userId).map(userMapper::map)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Felhasználó nem található ezzel az ID-val: " + userId));
    }

    public UserDto findByEmail(String email) {
        return userRepository.findByEmail(email).map(userMapper::map)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Felhasználó nem található ezzel az e-maillel: " + email));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).map(u -> new SimplePrincipal(u.getId(), u.getEmail(), u.getPassword(), u.getAuthorities()))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public PageResponse<UserDto> search(String email, String fullName, Role role, Pageable pageable) {
        return PageResponse.of(userRepository.search(email, fullName, role == null ? null : role.name(), pageable), userMapper::map);
    }

    @Transactional
    public void create(UserDto userDto) {
        User user = userMapper.map(userDto);
        user.setId(null);
        user.setReferralCode(null);

        userRepository.save(user);
        user.setReferralCode(PublicIdGenerator.generate(user.getId()));
        handleForgotPassword(userDto.email(), EmailTemplate.REGISTRATION);
    }

    @Transactional
    public void changePassword(OtpRequest otpRequest) {
        User user = userRepository.findByOneTimePassword(otpRequest.otp())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Felhasználó nem található ezzel a kóddal: " + otpRequest.otp()));

        user.setPassword(passwordEncoder.encode(otpRequest.password()));
        user.setOneTimePassword(null);
    }

    @Transactional
    public void handleForgotPassword(String email, EmailTemplate template) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return;
        }

        UUID oneTimePassword = UUID.randomUUID();
        user.get().setOneTimePassword(oneTimePassword);
        userRepository.save(user.get());

        String link = frontendUrl + "/change-password?otp=" + oneTimePassword;
        emailService.sendEmail(email, template, Map.of("name", user.get().getFullName(), "link", link));
    }

    public void createDefaultUser() {
        if (StringUtils.isBlank(adminEmail) || userRepository.count() > 0) {
            return;
        }

        User user = User.builder()
                .email(adminEmail)
                .fullName("Default Direktor")
                .roles(List.of(Role.ADMIN, Role.PARTNER))
                .referralCode(PublicIdGenerator.generate(1))
                .build();
        userRepository.save(user);
    }
}