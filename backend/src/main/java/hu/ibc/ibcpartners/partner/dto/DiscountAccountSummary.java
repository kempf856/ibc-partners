package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.core.dto.PageResponse;

import java.io.Serializable;

public record DiscountAccountSummary(PageResponse<DiscountAccountDto> pageResponse, Long allDiscounts, Long availableBalance) implements Serializable {}
