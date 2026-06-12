package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
}

