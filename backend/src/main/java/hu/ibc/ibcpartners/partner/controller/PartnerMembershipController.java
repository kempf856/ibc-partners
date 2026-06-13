package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.partner.dto.PartnerMembershipDto;
import hu.ibc.ibcpartners.partner.service.PartnerMembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partner-memberships")
@RequiredArgsConstructor
public class PartnerMembershipController {

    private final PartnerMembershipService partnerMembershipService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody PartnerMembershipDto req) {
        partnerMembershipService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partnerMembershipService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping
    public ResponseEntity<List<PartnerMembershipDto>> findByIds(@RequestParam(required = false) Long userId, @RequestParam(required = false) Long partnerId) {
        return ResponseEntity.ok(partnerMembershipService.findByIds(userId, partnerId));
    }
}

