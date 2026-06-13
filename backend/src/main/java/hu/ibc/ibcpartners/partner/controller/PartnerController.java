package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.PartnerDto;
import hu.ibc.ibcpartners.partner.service.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody PartnerDto req) {
        partnerService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody PartnerDto req) {
        if (!Objects.equals(id, req.id())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id nem egyezik!");
        }
        partnerService.update(req);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartnerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(partnerService.getById(id));
    }

    @GetMapping("/by-tax-number")
    public ResponseEntity<PartnerDto> findByTaxNumber(@RequestParam String taxNumber) {
        return ResponseEntity.ok(partnerService.findByTaxNumber(taxNumber));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PartnerDto>> search(
            @RequestParam(required = false) String name, @RequestParam(required = false) String address,
            @RequestParam(required = false) String activities, Pageable pageable) {
        Long[] activityIds = null;
        if (activities != null && !activities.isBlank()) {
            activityIds = java.util.Arrays.stream(activities.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Long::valueOf)
                    .toArray(Long[]::new);
        }

        return ResponseEntity.ok(partnerService.search(name, address, activityIds, pageable));
    }
}

