package hu.ibc.ibcpartners.notification.service;

import lombok.Getter;

public enum EmailTemplate {

    REGISTRATION("myIBC regisztráció"),
    FORGOTTEN_PASSWORD("myIBC elfelejtett jelszó");

    @Getter
    private final String subject;

    EmailTemplate(String subject) {
        this.subject = subject;
    }
}
