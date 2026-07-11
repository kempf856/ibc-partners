package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.CommissionDto;
import hu.ibc.ibcpartners.partner.dto.CommissionSummary;
import hu.ibc.ibcpartners.partner.entity.CommissionStatus;
import hu.ibc.ibcpartners.partner.service.CommissionService;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;

    @GetMapping("/my")
    public ResponseEntity<CommissionSummary> my(@RequestParam(required = false) CommissionStatus status, Pageable pageable) {
        CommissionSummary commissionSummary = commissionService.sumCommissions(AuthHelper.getUserId());
        return ResponseEntity.ok(new CommissionSummary(commissionService.search(AuthHelper.getUserId(), null, status, pageable),
                commissionSummary.allCommissions(), commissionSummary.billableCommissions()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PageResponse<CommissionDto>> search(@RequestParam(required = false) Long userId, @RequestParam(required = false) Long transactionId, Pageable pageable) {
        return ResponseEntity.ok(commissionService.search(userId, transactionId, null, pageable));
    }
}

