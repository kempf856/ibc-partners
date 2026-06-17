package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.partner.dto.PartnerDto;
import hu.ibc.ibcpartners.partner.entity.Partner;
import hu.ibc.ibcpartners.partner.mapper.PartnerMapper;
import hu.ibc.ibcpartners.partner.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class PartnerProvider {

    private final PartnerRepository partnerRepository;
    private final PartnerMapper partnerMapper;

    private Map<Long, PartnerDto> map;

    public Map<Long, PartnerDto> getAll() {
        if (map == null) {
            reset();
        }
        return map;
    }

    public void reset() {
        map = partnerRepository.findAll().stream().collect(Collectors.toMap(Partner::getId, partnerMapper::map));
    }

    public String getName(Long partnerId) {
        return getAll().get(partnerId).name();
    }
}
