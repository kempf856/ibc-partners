package hu.ibc.ibcpartners;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "securityAuditorAware")
public class IbcPartnersApp {

    public static void main(String[] args) {
        SpringApplication.run(IbcPartnersApp.class, args);
    }
}
