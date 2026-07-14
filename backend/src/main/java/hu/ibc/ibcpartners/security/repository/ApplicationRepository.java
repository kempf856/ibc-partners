package hu.ibc.ibcpartners.security.repository;

import hu.ibc.ibcpartners.security.entity.Application;
import hu.ibc.ibcpartners.security.entity.ApplicationState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("""
        SELECT a FROM Application a WHERE (:salesId IS NULL OR a.salesId = :salesId OR a.salesId IS NULL) AND (:states IS NULL OR a.state IN :states)
        """)
    Page<Application> findAllByStates(Long salesId, List<ApplicationState> states, Pageable pageable);
}