package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.TransactionDto;
import hu.ibc.ibcpartners.partner.dto.TransactionRequest;
import hu.ibc.ibcpartners.partner.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody TransactionRequest req) {
        transactionService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{id}/approve-seller")
    public ResponseEntity<Void> approveSeller(@PathVariable Long id) {
        transactionService.sellerApprove(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/{id}/approve-buyer")
    public ResponseEntity<Void> approveBuyer(@PathVariable Long id) {
        transactionService.buyerApprove(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/{id}/book")
    public ResponseEntity<Void> book(@PathVariable Long id) {
        transactionService.book(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<TransactionDto>> search(@RequestParam(required = false) Long partnerId, Pageable pageable) {
        return ResponseEntity.ok(transactionService.search(partnerId, pageable));
    }
}

