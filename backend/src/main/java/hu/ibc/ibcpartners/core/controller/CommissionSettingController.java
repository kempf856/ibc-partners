package hu.ibc.ibcpartners.core.controller;

import hu.ibc.ibcpartners.core.dto.CommissionSettingDto;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.partner.entity.Transaction;
import hu.ibc.ibcpartners.partner.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commission-settings")
@RequiredArgsConstructor
public class CommissionSettingController {

    private final CommissionSettingService commissionSettingService;
    private final TransactionService transactionService;

    @PutMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> update(@Valid @RequestBody CommissionSettingDto commissionSettingDto) {
        Transaction t = null;
        if (commissionSettingDto.transactionId() != null) {
            t = transactionService.findById(commissionSettingDto.transactionId());
        }
        commissionSettingService.update(commissionSettingDto, t);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommissionSettingDto> search(@RequestParam(required = false) Long partnerId, @RequestParam(required = false) Long transactionId) {
        return ResponseEntity.ok(commissionSettingService.getByIds(partnerId, transactionId));
    }
}

