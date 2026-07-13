package hu.ibc.ibcpartners.partner.dto;

import hu.ibc.ibcpartners.core.dto.PageResponse;

public record InvoiceSummary(PageResponse<InvoiceDto> pageResponse, Long allCommissions, Long billableCommissions) {}
