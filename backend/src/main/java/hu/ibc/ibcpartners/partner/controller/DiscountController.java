package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.DiscountDto;
import hu.ibc.ibcpartners.partner.service.DiscountService;
import hu.ibc.ibcpartners.partner.service.PartnerMembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;
    private final PartnerMembershipService partnerMembershipService;

    @GetMapping("/my")
    public ResponseEntity<PageResponse<DiscountDto>> my(@RequestParam(required = false) Long sellerId, @RequestParam(required = false) Long buyerId, Pageable pageable) {
        if (sellerId != null) {
            partnerMembershipService.checkMembership(sellerId);
            return ResponseEntity.ok(discountService.search(sellerId, null, pageable));
        }

        if (buyerId != null) {
            partnerMembershipService.checkMembership(buyerId);
            return ResponseEntity.ok(discountService.search(null, buyerId, pageable));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hiányzó eladó vagy vevő azonosító!");
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PageResponse<DiscountDto>> search(@RequestParam(required = false) Long sellerId, @RequestParam(required = false) Long buyerId, Pageable pageable) {
        return ResponseEntity.ok(discountService.search(sellerId, buyerId, pageable));
    }
}

