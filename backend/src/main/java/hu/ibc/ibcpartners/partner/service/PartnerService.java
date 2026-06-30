package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.partner.dto.PartnerDto;
import hu.ibc.ibcpartners.partner.entity.Partner;
import hu.ibc.ibcpartners.partner.mapper.PartnerMapper;
import hu.ibc.ibcpartners.partner.repository.PartnerRepository;
import hu.ibc.ibcpartners.security.entity.User;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerRepository partnerRepository;
    private final PartnerMapper partnerMapper;
    private final PartnerProvider partnerProvider;
    private final UserRepository userRepository;
    private final CommissionSettingService commissionSettingService;

    public PartnerDto getById(Long id) {
        return partnerMapper.map(findById(id));
    }

    private Partner findById(Long id) {
        return partnerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partner nem található ezzel az ID-val: " + id));
    }

    public PartnerDto findByTaxNumber(String taxNumber) {
        return partnerRepository.findByTaxNumber(taxNumber).map(partnerMapper::map)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partner nem található ezzel az adószámmal: " + taxNumber));
    }

    public PageResponse<PartnerDto> search(String filter, Long[] activityIds, Pageable pageable) {
        Page<Partner> page = partnerRepository.search(filter, activityIds == null ? new Long[] {} : activityIds, pageable);
        return PageResponse.of(page, partnerMapper::map);
    }

    public List<PartnerDto> getAll() {
        return partnerRepository.findAll().stream().map(partnerMapper::map).toList();
    }

    public List<PartnerDto> findByUserId(Long userId) {
        return partnerRepository.findByUserId(userId).stream().map(partnerMapper::map).toList();
    }

    @Transactional
    public void update(PartnerDto dto) {
        Partner partner = findById(dto.id());
        partnerMapper.map(dto, partner);
        partnerRepository.save(partner);
        partnerProvider.reset();
    }

    @Transactional
    public void create(PartnerDto dto, String referralCode) {
        Partner partner = partnerMapper.map(dto);
        if (StringUtils.isNotBlank(referralCode)) {
            partner.setReferralId(userRepository.findByReferralCode(referralCode).map(User::getId).orElse(null));
        }
        if (partner.getReferralId() == null) {
            partner.setReferralId(AuthHelper.getUserId());
        }
        partnerRepository.save(partner);
        partnerProvider.reset();

        commissionSettingService.createForPartner(partner.getId(), partner.getReferralId());
    }
}
