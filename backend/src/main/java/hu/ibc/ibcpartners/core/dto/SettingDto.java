package hu.ibc.ibcpartners.core.dto;

import hu.ibc.ibcpartners.core.entity.SettingKey;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record SettingDto(@NotEmpty SettingKey key, @NotBlank String name, @NotBlank String value) {
}
