package hu.ibc.ibcpartners.security.dto;

import hu.ibc.ibcpartners.security.entity.ApplicationState;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record ApplicationDto(
        Long id,
        String email,
        String fullName,
        String phone,
        String companyName,
        String taxNumber,
        String source,
        String comment,
        ApplicationState state,
        Long salesId,
        String salesName,
        String referralCode,
        Instant createdAt,
        Instant modifiedAt
) {}
