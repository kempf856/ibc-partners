package hu.ibc.ibcpartners.core.controller;

import hu.ibc.ibcpartners.core.dto.CityDto;
import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.service.CityService;
import hu.ibc.ibcpartners.partner.dto.PartnerDto;
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
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> create(@RequestBody CityDto req) {
        cityService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody CityDto req) {
        if (!Objects.equals(id, req.id())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id nem egyezik!");
        }
        cityService.update(req);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CityDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<CityDto>> search(Pageable pageable) {
        return ResponseEntity.ok(cityService.search(pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CityDto>> getAll() {
        return ResponseEntity.ok(cityService.getAll());
    }
}

