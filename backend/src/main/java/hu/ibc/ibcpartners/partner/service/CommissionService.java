package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.partner.entity.Commission;
import hu.ibc.ibcpartners.partner.entity.CommissionStatus;
import hu.ibc.ibcpartners.partner.repository.CommissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionSettingService commissionSettingService;
    private final CommissionRepository commissionRepository;

    @Transactional
    public void bookCommission(Long transactionId, Long amount) {
        CommissionSetting setting = commissionSettingService.findByIds(null, transactionId);

        bookCommission(transactionId, setting.getDirector1Id(), setting.getDirector1Percent(), amount);
        bookCommission(transactionId, setting.getDirector2Id(), setting.getDirector2Percent(), amount);
        bookCommission(transactionId, setting.getDirector3Id(), setting.getDirector3Percent(), amount);
        bookCommission(transactionId, setting.getReferralId(), setting.getReferralPercent(), amount);
    }

    private void bookCommission(Long transactionId, Long userId, Integer percent, Long amount) {
        if (userId == null || percent == null) {
            return;
        }

        Commission commission = Commission.builder()
                .transactionId(transactionId)
                .userId(userId)
                .commission(amount * percent / 100)
                .status(CommissionStatus.LISTED)
                .build();
        commissionRepository.save(commission);
    }
}
