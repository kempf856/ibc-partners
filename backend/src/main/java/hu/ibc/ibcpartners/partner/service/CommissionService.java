package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.partner.dto.CommissionDto;
import hu.ibc.ibcpartners.partner.dto.CommissionSummary;
import hu.ibc.ibcpartners.partner.entity.Commission;
import hu.ibc.ibcpartners.partner.entity.CommissionStatus;
import hu.ibc.ibcpartners.partner.repository.CommissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionSettingService commissionSettingService;
    private final CommissionRepository commissionRepository;

    public PageResponse<CommissionDto> search(Long userId, Long transactionId, CommissionStatus status, Pageable pageable) {
        Page<CommissionDto> commissionPage = commissionRepository.search(userId, transactionId, status, pageable);
        return PageResponse.of(commissionPage, Function.identity());
    }

    public CommissionSummary sumCommissions(Long userId) {
        return commissionRepository.sumCommissions(userId);
    }

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
