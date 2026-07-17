package hu.ibc.ibcpartners.dashboard.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.dashboard.dto.SlideDto;
import hu.ibc.ibcpartners.dashboard.service.SlideService;
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
@RequestMapping("/api/slides")
@RequiredArgsConstructor
public class SlideController {

    private final SlideService slideService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> create(@RequestBody SlideDto req) {
        slideService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody SlideDto req) {
        if (!Objects.equals(id, req.id())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id nem egyezik!");
        }
        slideService.update(req);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        slideService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SlideDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(slideService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PageResponse<SlideDto>> search(@RequestParam(required = false) Boolean active, Pageable pageable) {
        return ResponseEntity.ok(slideService.search(active, pageable));
    }

    @GetMapping("/all-visible")
    public ResponseEntity<List<SlideDto>> getAllVisible() {
        return ResponseEntity.ok(slideService.getAllVisible());
    }
}

