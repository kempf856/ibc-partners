package hu.ibc.ibcpartners.security.service;

import hu.ibc.ibcpartners.security.entity.Role;
import hu.ibc.ibcpartners.security.entity.User;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
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

    @PostConstruct
    public void initUsers() {
        createDefaultUser();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
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