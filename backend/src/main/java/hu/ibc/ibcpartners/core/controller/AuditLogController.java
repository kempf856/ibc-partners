package hu.ibc.ibcpartners.core.controller;

import hu.ibc.ibcpartners.core.dto.AuditLogDto;
import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PageResponse<AuditLogDto>> search(Pageable pageable) {
        return ResponseEntity.ok(auditLogService.search(pageable));
    }
}

