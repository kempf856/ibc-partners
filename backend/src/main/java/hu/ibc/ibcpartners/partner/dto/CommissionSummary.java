package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.core.dto.PageResponse;

import java.io.Serializable;

public record CommissionSummary(PageResponse<CommissionDto> pageResponse, Long allCommissions, Long billableCommissions) implements Serializable {}
