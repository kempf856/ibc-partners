package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.entity.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long> {

	@Query(value = """
        SELECT * FROM partners p WHERE (:name IS NULL OR p.name ILIKE concat(:name, '%'))
        AND (:address IS NULL OR p.headquarters ILIKE concat(:address, '%') OR p.site ILIKE concat(:address, '%'))
        AND (cardinality(cast(:ids AS INTEGER[])) = 0 OR p.activities && cast(:ids AS INTEGER[]))
        """, nativeQuery = true)
    Page<Partner> search(String name, String address, Long[] ids, Pageable pageable);

    Optional<Partner> findByTaxNumber(String taxNumber);

    @Query(value = """
        SELECT EXISTS (SELECT 1 FROM partners p WHERE :activityId = ANY(p.activities))
        """, nativeQuery = true)
    boolean activityExists(Long activityId);
}

