package hu.ibc.ibcpartners.core.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.dto.SettingDto;
import hu.ibc.ibcpartners.core.entity.SettingKey;
import hu.ibc.ibcpartners.core.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> create(@RequestBody SettingDto req) {
        settingService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> update(@PathVariable SettingKey key, @RequestBody SettingDto req) {
        if (!Objects.equals(key, req.key())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kulcs nem egyezik!");
        }
        settingService.update(req);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PageResponse<SettingDto>> search(Pageable pageable) {
        return ResponseEntity.ok(settingService.search(pageable));
    }
}

