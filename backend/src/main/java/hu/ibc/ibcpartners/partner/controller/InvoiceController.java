package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.partner.dto.InvoiceDto;
import hu.ibc.ibcpartners.partner.dto.InvoiceRequest;
import hu.ibc.ibcpartners.partner.dto.InvoiceSummary;
import hu.ibc.ibcpartners.partner.service.InvoiceService;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;;

    @GetMapping("/my")
    public ResponseEntity<InvoiceSummary> my(Pageable pageable) {
        return ResponseEntity.ok(invoiceService.search(AuthHelper.getUserId(), pageable));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<InvoiceSummary> search(@RequestParam Long userId, Pageable pageable) {
        return ResponseEntity.ok(invoiceService.search(userId, pageable));
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody InvoiceRequest invoiceRequest) {
        invoiceService.create(invoiceRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id:\\d+}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<InvoiceDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @GetMapping("/{id}/my")
    public ResponseEntity<InvoiceDto> getMy(@PathVariable Long id) {
        InvoiceDto invoiceDto = invoiceService.getById(id);
        if (!invoiceDto.userId().equals(AuthHelper.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nincs jogod ehhez a számlához: " + id);
        }
        return ResponseEntity.ok(invoiceDto);
    }
}

