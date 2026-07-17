package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.ActivityDto;
import hu.ibc.ibcpartners.partner.entity.Activity;
import hu.ibc.ibcpartners.partner.mapper.ActivityMapper;
import hu.ibc.ibcpartners.partner.repository.ActivityRepository;
import hu.ibc.ibcpartners.partner.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;
    private final PartnerRepository partnerRepository;

    public ActivityDto getById(Long id) {
        return activityMapper.map(findById(id));
    }

    private Activity findById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tevékenység nem található ezzel az ID-val: " + id));
    }

    public PageResponse<ActivityDto> search(String activity, Pageable pageable) {
        Page<Activity> page = activityRepository.search(activity, pageable);
        return PageResponse.of(page, activityMapper::map);
    }

    public void create(ActivityDto dto) {
        activityRepository.save(activityMapper.map(dto));
    }

    @Transactional
    public void update(ActivityDto dto) {
        Activity activity = findById(dto.id());
        activityMapper.map(dto, activity);
        activityRepository.save(activity);
    }

    public void delete(Long id) {
        if (partnerRepository.activityExists(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A tevékenység nem törölhető, mart használatban van!");
        }
        activityRepository.deleteById(id);
    }
}
