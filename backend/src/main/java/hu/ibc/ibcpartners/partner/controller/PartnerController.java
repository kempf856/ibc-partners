package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.PartnerDto;
import hu.ibc.ibcpartners.partner.service.PartnerService;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SALES')")
    public ResponseEntity<Void> create(@RequestBody PartnerDto req, @RequestParam(required = false) String referralCode) {
        partnerService.create(req, referralCode);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody PartnerDto req) {
        if (!Objects.equals(id, req.id())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id nem egyezik!");
        }
        partnerService.update(req);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<PartnerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(partnerService.getById(id));
    }

    @GetMapping("/by-tax-number")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SALES')")
    public ResponseEntity<PartnerDto> findByTaxNumber(@RequestParam String taxNumber) {
        return ResponseEntity.ok(partnerService.findByTaxNumber(taxNumber));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PartnerDto>> search(
            @RequestParam(required = false) Boolean browsableOnly, @RequestParam(required = false) String filter,
            @RequestParam(required = false) String activities, Pageable pageable) {
        Long[] activityIds = null;
        if (activities != null && !activities.isBlank()) {
            activityIds = java.util.Arrays.stream(activities.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Long::valueOf)
                    .toArray(Long[]::new);
        }

        return ResponseEntity.ok(partnerService.search(browsableOnly, filter, activityIds, pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PartnerDto>> getAll() {
        return ResponseEntity.ok(partnerService.getAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<PartnerDto>> getActive() {
        return ResponseEntity.ok(partnerService.findByUserId(AuthHelper.getUserId()));
    }
}

