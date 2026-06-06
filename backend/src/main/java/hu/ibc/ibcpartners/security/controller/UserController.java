package hu.ibc.ibcpartners.security.controller;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.security.dto.UserDto;
import hu.ibc.ibcpartners.security.entity.Role;
import hu.ibc.ibcpartners.security.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> profile() {
        return ResponseEntity.ok(userService.getLoggedInUser());
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserDto> findByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<PageResponse<UserDto>> search(String email, String fullName, Role role, Pageable pageable) {
        return ResponseEntity.ok(userService.search(email, fullName, role, pageable));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody UserDto userDto) {
        userService.create(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
