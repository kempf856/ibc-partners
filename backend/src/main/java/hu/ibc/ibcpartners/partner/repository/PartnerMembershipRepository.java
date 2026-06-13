package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.entity.Partner;
import hu.ibc.ibcpartners.partner.entity.PartnerMembership;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerMembershipRepository extends JpaRepository<PartnerMembership, Long> {

    @Query("""
        SELECT pm FROM PartnerMembership pm
        WHERE (:userId IS NULL OR pm.userId = :userId) AND (:partnerId IS NULL OR pm.partnerId = :partnerId)
        """)
    List<PartnerMembership> findByIds(Long userId, Long partnerId);
}

