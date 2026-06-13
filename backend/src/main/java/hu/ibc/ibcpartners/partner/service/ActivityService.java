package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.common.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.ActivityDto;
import hu.ibc.ibcpartners.partner.dto.PartnerDto;
import hu.ibc.ibcpartners.partner.entity.Activity;
import hu.ibc.ibcpartners.partner.entity.Partner;
import hu.ibc.ibcpartners.partner.mapper.ActivityMapper;
import hu.ibc.ibcpartners.partner.mapper.PartnerMapper;
import hu.ibc.ibcpartners.partner.repository.ActivityRepository;
import hu.ibc.ibcpartners.partner.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;

    public ActivityDto findById(Long id) {
        return activityRepository.findById(id).map(activityMapper::map)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tevékenység nem található ezzel az ID-val: " + id));
    }

    public PageResponse<ActivityDto> search(String activity, Pageable pageable) {
        Page<Activity> page = activityRepository.search(activity, pageable);
        return PageResponse.of(page, activityMapper::map);
    }

    public void create(ActivityDto dto) {
        activityRepository.save(activityMapper.map(dto));
    }
}
