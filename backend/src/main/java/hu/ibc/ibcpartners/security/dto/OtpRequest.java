package hu.ibc.ibcpartners.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OtpRequest(@NotNull UUID otp, @NotBlank String password) {}