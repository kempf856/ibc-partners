package hu.ibc.ibcpartners.security.service;

import java.security.SecureRandom;

public class PublicIdGenerator {

    private static final String CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXY";
    private static final SecureRandom RANDOM = new SecureRandom();

    private PublicIdGenerator() {
    }

    public static String generate(long serialId) {
        String uniquePart = "Z" + Long.toString(serialId, 35).toUpperCase();
        if (uniquePart.length() > 8) {
            throw new IllegalStateException("Serial ID too large for 8-character public ID: " + serialId);
        }

        int prefixLength = 8 - uniquePart.length();
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < prefixLength; i++) {
            result.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        result.append(uniquePart);

        return result.toString();
    }
}