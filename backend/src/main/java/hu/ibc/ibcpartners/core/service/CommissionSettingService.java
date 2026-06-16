package hu.ibc.ibcpartners.core.service;

import hu.ibc.ibcpartners.core.dto.CommissionSettingDto;
import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.mapper.CommissionSettingMapper;
import hu.ibc.ibcpartners.core.repository.CommissionSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommissionSettingService {

    private final CommissionSettingRepository commissionSettingRepository;
    private final CommissionSettingMapper commissionSettingMapper;

    @Transactional
    public CommissionSettingDto getByIds(Long partnerId, Long transactionId) {
        return commissionSettingMapper.map(findByIds(partnerId, transactionId));
    }

    private CommissionSetting findByIds(Long partnerId, Long transactionId) {
        return commissionSettingRepository.findByIds(partnerId, transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jutalék beállítás nem található a partherhez [" + partnerId + "] és ügylethez [" + transactionId + "]"));
    }

    @Transactional
    public void createForPartner(Long partnerId, Long referralId) {
        CommissionSetting globalSetting = findByIds(null, null);
        CommissionSetting partnerSetting = new CommissionSetting(globalSetting);
        partnerSetting.setPartnerId(partnerId);
        partnerSetting.setReferralId(referralId);
        commissionSettingRepository.save(partnerSetting);
    }

    @Transactional
    public void createForTransaction(Long partnerId, Long transactionId) {
        CommissionSetting globalSetting = findByIds(partnerId, null);
        CommissionSetting partnerSetting = new CommissionSetting(globalSetting);
        partnerSetting.setTransactionId(transactionId);
        commissionSettingRepository.save(partnerSetting);
    }

    @Transactional
    public void update(CommissionSettingDto dto) {
        if (nvl(dto.director1Percent()) + nvl(dto.director2Percent()) + nvl(dto.director3Percent()) + nvl(dto.referralPercent()) > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A jutalékok összege nem lehet nagyobb, mint 100%!");
        }

        CommissionSetting setting = findByIds(dto.partnerId(), dto.transactionId());
        commissionSettingMapper.map(dto, setting);
        commissionSettingRepository.save(setting);
    }

    private int nvl(Integer percent) {
        return percent == null ? 0 : percent;
    }

    public void createDefaultSetting() {
        Optional<CommissionSetting> found = commissionSettingRepository.findByIds(null, null);
        if (found.isPresent()) {
            return;
        }

        CommissionSetting setting = new CommissionSetting();
        setting.setDirector1Id(1L);
        setting.setDirector1Percent(80);
        setting.setReferralPercent(10);
        commissionSettingRepository.save(setting);
    }
}
