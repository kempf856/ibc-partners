package hu.ibc.ibcpartners.dashboard.repository;

import hu.ibc.ibcpartners.dashboard.entity.Slide;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SlideRepository extends JpaRepository<Slide, Long> {

    @Query(value = """
        SELECT s FROM Slide s WHERE (:active IS NULL OR s.active = :active)
        """)
    Page<Slide> search(Boolean active, Pageable pageable);

    @Query(value = """
        SELECT s FROM Slide s WHERE (s.visibleFrom Is NULL OR s.visibleFrom <= CURRENT_DATE) AND (s.visibleTo IS NULL OR s.visibleTo > CURRENT_DATE)
            AND s.active = true
        """)
    List<Slide> getAllVisible();
}

