package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.InvoiceDto;
import hu.ibc.ibcpartners.partner.dto.InvoiceRequest;
import hu.ibc.ibcpartners.partner.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;;

    @GetMapping("/my")
    public ResponseEntity<PageResponse<InvoiceDto>> my(Pageable pageable) {
        return ResponseEntity.ok(invoiceService.my(pageable));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PageResponse<InvoiceDto>> search(@RequestParam(required = false) String userName, Pageable pageable) {
        return ResponseEntity.ok(invoiceService.search(userName, pageable));
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody InvoiceRequest invoiceRequest) {
        invoiceService.create(invoiceRequest);
        return ResponseEntity.ok().build();
    }
}

