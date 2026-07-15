package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.dto.PartnerMembershipDto;
import hu.ibc.ibcpartners.partner.entity.PartnerMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnerMembershipRepository extends JpaRepository<PartnerMembership, Long> {

    @Query("""
        SELECT new hu.ibc.ibcpartners.partner.dto.PartnerMembershipDto(
            pm.id, pm.userId, u.fullName, u.email, u.phone, pm.partnerId, p.name, pm.role)
        FROM PartnerMembership pm JOIN User u ON pm.userId = u.id JOIN Partner p ON pm.partnerId = p.id
        WHERE (:userId IS NULL OR pm.userId = :userId) AND (:partnerId IS NULL OR pm.partnerId = :partnerId)
        ORDER BY pm.role DESC
        """)
    List<PartnerMembershipDto> findByIds(Long userId, Long partnerId);
}

