package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.entity.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long> {

	@Query(value = """
        SELECT * FROM partners p WHERE (:filter IS NULL OR p.name ILIKE concat(:filter, '%') OR p.key_words ILIKE concat('%', :filter, '%')
        OR p.location ILIKE concat(:filter, '%'))
        AND (cardinality(cast(:ids AS INTEGER[])) = 0 OR p.activities && cast(:ids AS INTEGER[]))
        """, nativeQuery = true)
    Page<Partner> search(String filter, Long[] ids, Pageable pageable);

    Optional<Partner> findByTaxNumber(String taxNumber);

    @Query(value = """
        SELECT EXISTS (SELECT 1 FROM partners p WHERE :activityId = ANY(p.activities))
        """, nativeQuery = true)
    boolean activityExists(Long activityId);

    @Query(value = """
        SELECT p from Partner p JOIN PartnerMembership pm ON p.id = pm.partnerId WHERE pm.userId = :userId
        """)
    List<Partner> findByUserId(Long userId);
}

