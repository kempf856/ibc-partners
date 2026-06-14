package hu.ibc.ibcpartners.dashboard.controller;

import hu.ibc.ibcpartners.dashboard.dto.DashboardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    @GetMapping
    public ResponseEntity<DashboardDto> welcome() {
        return ResponseEntity.ok(new DashboardDto("Működő menüpontok: Partner adatbázis | Éreklődők | Felhasználók | Saját fiók"));
    }
}
