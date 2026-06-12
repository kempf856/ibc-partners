package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.partner.entity.Activity;
import hu.ibc.ibcpartners.partner.entity.Partner;
import hu.ibc.ibcpartners.partner.repository.ActivityRepository;
import hu.ibc.ibcpartners.partner.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerRepository partnerRepository;
    private final ActivityRepository activityRepository;

    @Transactional(readOnly = true)
    public Optional<Partner> findByIdWithActivities(Long id) {
        return partnerRepository.findById(id).map(p -> {
            populateActivities(p);
            return p;
        });
    }

    @Transactional(readOnly = true)
    public List<Partner> findAllWithActivities() {
        List<Partner> partners = partnerRepository.findAll();
        populateActivitiesForMany(partners);
        return partners;
    }

    @Transactional
    public Partner save(Partner partner) {
        // If caller set activities (entity list), convert to ids before saving
        if (partner.getActivities() != null) {
            List<Long> ids = partner.getActivities().stream()
                    .map(Activity::getId)
                    .toList();
            partner.setActivityIds(ids);
        }
        return partnerRepository.save(partner);
    }

    private void populateActivities(Partner p) {
        List<Long> ids = p.getActivityIds();
        if (ids == null || ids.isEmpty()) {
            p.setActivities(Collections.emptyList());
            return;
        }
        p.setActivities(activityRepository.findAllById(ids));
    }

    private void populateActivitiesForMany(List<Partner> partners) {
        // collect all activity ids
        List<Activity> activities = activityRepository.findAll();
        Map<Long, Activity> activityById = activities.stream().collect(Collectors.toMap(Activity::getId, Function.identity()));

        for (Partner p : partners) {
            List<Long> ids = p.getActivityIds();
            if (ids == null || ids.isEmpty()) {
                p.setActivities(Collections.emptyList());
                continue;
            }

            p.setActivities(ids.stream()
                    .map(activityById::get)
                    .toList());
        }
    }
}
