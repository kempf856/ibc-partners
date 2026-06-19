package hu.ibc.ibcpartners.core.dto;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {

    public static <R, T> PageResponse<T> of(Page<R> p, Function<R, T> mapper) {
        return new PageResponse<>(p.map(mapper).getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
    }
}