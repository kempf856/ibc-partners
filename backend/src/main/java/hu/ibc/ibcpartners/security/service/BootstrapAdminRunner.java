package hu.ibc.ibcpartners.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BootstrapAdminRunner implements ApplicationRunner {

    private final UserService userService;

    @Override
    public void run(ApplicationArguments args) {
        userService.createDefaultUser();
    }
}