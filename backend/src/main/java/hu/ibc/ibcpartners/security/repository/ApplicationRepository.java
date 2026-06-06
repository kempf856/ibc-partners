package hu.ibc.ibcpartners.security.repository;

import hu.ibc.ibcpartners.security.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
}