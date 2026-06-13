package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.partner.dto.PartnerMembershipDto;
import hu.ibc.ibcpartners.partner.entity.PartnerMembership;
import hu.ibc.ibcpartners.partner.mapper.PartnerMembershipMapper;
import hu.ibc.ibcpartners.partner.repository.PartnerMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartnerMembershipService {

    private final PartnerMembershipRepository partnerMembershipRepository;
    private final PartnerMembershipMapper partnerMembershipMapper;

    public List<PartnerMembershipDto> findByIds(Long userId, Long partnerId) {
        return partnerMembershipRepository.findByIds(userId, partnerId).stream().map(partnerMembershipMapper::map).toList();
    }

    public void create(PartnerMembershipDto partnerMembershipDto) {
        partnerMembershipRepository.save(partnerMembershipMapper.map(partnerMembershipDto));
    }

    public void delete(Long id) {
        partnerMembershipRepository.deleteById(id);
    }
}
