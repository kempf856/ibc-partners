package hu.ibc.ibcpartners.notification.service;

import lombok.Getter;

public enum EmailTemplate {

    REGISTRATION("myIBC regisztráció"),
    FORGOTTEN_PASSWORD("myIBC elfelejtett jelszó"),
    SELLER_APPROVAL("myIBC ügylet jóváhagyás"),
    BUYER_APPROVAL("myIBC ügylet jóváhagyás"),
    COMMISSION_SETTING_CHANGED("myIBC jutalék beállítás változás");

    @Getter
    private final String subject;

    EmailTemplate(String subject) {
        this.subject = subject;
    }
}
