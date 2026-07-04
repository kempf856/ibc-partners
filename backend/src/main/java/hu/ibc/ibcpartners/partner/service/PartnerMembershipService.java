package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.partner.dto.PartnerMembershipDto;
import hu.ibc.ibcpartners.partner.mapper.PartnerMembershipMapper;
import hu.ibc.ibcpartners.partner.repository.PartnerMembershipRepository;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartnerMembershipService {

    private final PartnerMembershipRepository partnerMembershipRepository;
    private final PartnerMembershipMapper partnerMembershipMapper;

    public void checkMembership(Long partnerId) {
        if (!hasMembership(partnerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nincs jogod ehhez a partnerhez: " + partnerId);
        }
    }

    public boolean hasMembership(Long partnerId) {
        List<PartnerMembershipDto> partnerMemberships = findByIds(AuthHelper.getUserId(), partnerId);
        return !partnerMemberships.isEmpty();
    }

    public List<PartnerMembershipDto> findByIds(Long userId, Long partnerId) {
        return partnerMembershipRepository.findByIds(userId, partnerId);
    }

    public void create(PartnerMembershipDto partnerMembershipDto) {
        if (!findByIds(partnerMembershipDto.userId(), partnerMembershipDto.partnerId()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ez a partner kapcsolat már létezik!");
        }
        partnerMembershipRepository.save(partnerMembershipMapper.map(partnerMembershipDto));
    }

    public void delete(Long id) {
        partnerMembershipRepository.deleteById(id);
    }
}
