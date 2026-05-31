package hu.ibc.ibcpartners.security.dto;

import hu.ibc.ibcpartners.security.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record UserDto(Long id, @Email @NotBlank String email, @NotBlank String fullName, @NotEmpty List<Role> roles) {}
