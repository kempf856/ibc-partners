package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.dto.DiscountDto;
import hu.ibc.ibcpartners.partner.entity.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

    @Query("""
        SELECT new hu.ibc.ibcpartners.partner.dto.DiscountDto(
                d.id, d.sellerId, d.buyerId, d.transactionId, ps.name, pb.name, t.description, t.fulfillmentDate, t.amount, d.discount, d.status)
        FROM Discount d
        JOIN Partner ps ON ps.id = d.sellerId
        JOIN Partner pb ON pb.id = d.buyerId
        JOIN Transaction t ON t.id = d.transactionId
        WHERE (:buyerId IS NULL OR d.buyerId = :buyerId) AND (:sellerId IS NULL OR d.sellerId = :sellerId)
        """)
    Page<DiscountDto> search(Long sellerId, Long buyerId, Pageable pageable);
}

