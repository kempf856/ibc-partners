package hu.ibc.ibcpartners.partner.controller;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.ActivityDto;
import hu.ibc.ibcpartners.partner.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody ActivityDto req) {
        activityService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.findById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ActivityDto>> search(@RequestParam(required = false) String activity, Pageable pageable) {
        return ResponseEntity.ok(activityService.search(activity, pageable));
    }
}

