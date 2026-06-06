package hu.ibc.ibcpartners.security.controller;

import hu.ibc.ibcpartners.notification.service.EmailTemplate;
import hu.ibc.ibcpartners.security.dto.*;
import hu.ibc.ibcpartners.security.service.ApplicationService;
import hu.ibc.ibcpartners.security.service.JwtService;
import hu.ibc.ibcpartners.security.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final ApplicationService applicationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (AuthenticationException e) {
            log.error(e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Hibás e-mail cím vagy jelszó!");
        }

        String token = jwtService.generateToken(authentication);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody OtpRequest request) {
        userService.changePassword(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/application")
    public ResponseEntity<Void> application(@Valid @RequestBody ApplicationRequest request) {
        applicationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/forgotten-password")
    public ResponseEntity<Void> forgottenPassword(@Valid @RequestBody ForgottenPasswordRequest request) {
        userService.handleForgotPassword(request.email(), EmailTemplate.FORGOTTEN_PASSWORD);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
