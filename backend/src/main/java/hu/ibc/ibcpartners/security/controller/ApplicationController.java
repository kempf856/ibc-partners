package hu.ibc.ibcpartners.security.controller;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.security.dto.ApplicationComment;
import hu.ibc.ibcpartners.security.dto.ApplicationDto;
import hu.ibc.ibcpartners.security.entity.ApplicationState;
import hu.ibc.ibcpartners.security.service.ApplicationService;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
@Slf4j
public class ApplicationController {

    private final ApplicationService applicationService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<PageResponse<ApplicationDto>> search(@RequestParam(required = false) List<ApplicationState> states, Pageable pageable) {
        return ResponseEntity.ok(applicationService.search(null, states, pageable));
    }

    @PreAuthorize("hasAuthority('SALES')")
    @GetMapping("/my")
    public ResponseEntity<PageResponse<ApplicationDto>> searchMy(@RequestParam(required = false) List<ApplicationState> states, Pageable pageable) {
        return ResponseEntity.ok(applicationService.search(AuthHelper.getUserId(), states, pageable));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SALES')")
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.get(id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SALES')")
    @PostMapping("/{id}/process")
    public ResponseEntity<ApplicationDto> process(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.changeState(id, ApplicationState.IN_PROGRESS, AuthHelper.getUserId()));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SALES')")
    @PostMapping("/{id}/accept")
    public ResponseEntity<ApplicationDto> accept(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.changeState(id, ApplicationState.ACCEPTED, null));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SALES')")
    @PostMapping("/{id}/deny")
    public ResponseEntity<ApplicationDto> deny(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.changeState(id, ApplicationState.DENIED, null));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{id}/comment")
    public ResponseEntity<ApplicationDto> comment(@PathVariable Long id, @RequestBody ApplicationComment applicationComment) {
        return ResponseEntity.ok(applicationService.comment(id, applicationComment));
    }
}
