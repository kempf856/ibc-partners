package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.CommissionDto;
import hu.ibc.ibcpartners.partner.service.CommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;

    @GetMapping
    public ResponseEntity<PageResponse<CommissionDto>> search(@RequestParam(required = false) Long userId, @RequestParam(required = false) Long transactionId, Pageable pageable) {
        return ResponseEntity.ok(commissionService.search(userId, transactionId, pageable));
    }
}

