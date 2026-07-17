package hu.ibc.ibcpartners.dashboard.dto;

import java.time.LocalDate;

public record SlideDto(
        Long id,
        String description,
        String slide,
        Boolean active,
        LocalDate visibleFrom,
        LocalDate visibleTo,
        Long sortOrder) {
}

