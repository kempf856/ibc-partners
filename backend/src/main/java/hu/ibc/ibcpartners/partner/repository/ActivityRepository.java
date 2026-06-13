package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.entity.Activity;
import hu.ibc.ibcpartners.partner.entity.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query(value = """
        SELECT a FROM Activity a WHERE (:activity IS NULL OR a.activity ILIKE :activity%)
        """)
    Page<Activity> search(String activity, Pageable pageable);
}

