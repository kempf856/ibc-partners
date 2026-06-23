package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

}

