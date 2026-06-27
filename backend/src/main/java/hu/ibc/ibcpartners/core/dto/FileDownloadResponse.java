package hu.ibc.ibcpartners.core.dto;

import org.springframework.core.io.Resource;

public record FileDownloadResponse(Resource resource, String contentType) {}
