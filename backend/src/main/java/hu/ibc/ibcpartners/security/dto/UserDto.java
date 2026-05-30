package hu.ibc.ibcpartners.security.dto;

import hu.ibc.ibcpartners.security.entity.Role;

import java.util.List;

public record UserDto(Long id, String email, String fullName, List<Role> roles) {}
