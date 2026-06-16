package hu.ibc.ibcpartners.core.controller;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.core.dto.CommissionSettingDto;
import hu.ibc.ibcpartners.core.dto.SettingDto;
import hu.ibc.ibcpartners.core.entity.SettingKey;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.core.service.SettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@RestController
@RequestMapping("/api/commission-settings")
@RequiredArgsConstructor
public class CommissionSettingController {

    private final CommissionSettingService commissionSettingService;

    @PutMapping
    public ResponseEntity<Void> update(@Valid @RequestBody CommissionSettingDto commissionSettingDto) {
        commissionSettingService.update(commissionSettingDto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping
    public ResponseEntity<CommissionSettingDto> search(@RequestParam(required = false) Long partnerId, @RequestParam(required = false) Long transactionId) {
        return ResponseEntity.ok(commissionSettingService.getByIds(partnerId, transactionId));
    }
}

