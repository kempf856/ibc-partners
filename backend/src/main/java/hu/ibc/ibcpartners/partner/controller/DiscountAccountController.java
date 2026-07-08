package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.DiscountAccountDto;
import hu.ibc.ibcpartners.partner.dto.DiscountDto;
import hu.ibc.ibcpartners.partner.service.DiscountAccountService;
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
@RequestMapping("/api/discount-accounts")
@RequiredArgsConstructor
public class DiscountAccountController {

    private final DiscountAccountService discountAccountService;
    private final PartnerMembershipService partnerMembershipService;

    @PreAuthorize("hasAuthority('PARTNER')")
    @GetMapping("/my")
    public ResponseEntity<PageResponse<DiscountAccountDto>> my(@RequestParam(required = false) Long sellerId, @RequestParam(required = false) Long buyerId, Pageable pageable) {
        if (sellerId != null) {
            partnerMembershipService.checkMembership(sellerId);
            return ResponseEntity.ok(discountAccountService.search(sellerId, null, pageable));
        }

        if (buyerId != null) {
            partnerMembershipService.checkMembership(buyerId);
            return ResponseEntity.ok(discountAccountService.search(null, buyerId, pageable));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hiányzó eladó vagy vevő azonosító!");
    }

    @PreAuthorize("hasAuthority('PARTNER')")
    @GetMapping("/my/by-partner")
    public ResponseEntity<DiscountAccountDto> myByPartner(@RequestParam Long sellerId, @RequestParam Long buyerId) {
        if (!partnerMembershipService.hasMembership(sellerId) && !partnerMembershipService.hasMembership(buyerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nincs jogod ezekhez a partnerekhez!");
        }

        return ResponseEntity.ok(discountAccountService.getByPartners(sellerId, buyerId));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/by-partner")
    public ResponseEntity<DiscountAccountDto> getByPartner(@RequestParam Long sellerId, @RequestParam Long buyerId) {
        return ResponseEntity.ok(discountAccountService.getByPartners(sellerId, buyerId));
    }
}

