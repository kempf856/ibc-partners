package hu.ibc.ibcpartners.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record ApplicationRequest(
        @Email @NotBlank String email,
        @NotBlank String fullName,
        @NotBlank String phone,
        @NotBlank String companyName,
        @NotBlank String taxNumber,
        @NotBlank String source,
        String referralCode
) {}
