package hu.ibc.ibcpartners.core.controller;

import hu.ibc.ibcpartners.core.dto.CommissionSettingDto;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
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

    @PutMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> update(@Valid @RequestBody CommissionSettingDto commissionSettingDto) {
        commissionSettingService.update(commissionSettingDto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CommissionSettingDto> search(@RequestParam(required = false) Long partnerId, @RequestParam(required = false) Long transactionId) {
        return ResponseEntity.ok(commissionSettingService.getByIds(partnerId, transactionId));
    }
}

