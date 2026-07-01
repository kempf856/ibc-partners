package hu.ibc.ibcpartners.core.repository;

import hu.ibc.ibcpartners.core.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
}

