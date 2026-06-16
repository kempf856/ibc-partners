package hu.ibc.ibcpartners.config;

import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BootstrapAdminRunner implements ApplicationRunner {

    private final UserService userService;
    private final CommissionSettingService commissionSettingService;

    @Override
    public void run(ApplicationArguments args) {
        userService.createDefaultUser();
        commissionSettingService.createDefaultSetting();
    }
}