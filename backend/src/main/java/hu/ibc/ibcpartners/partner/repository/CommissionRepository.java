package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.dto.CommissionDto;
import hu.ibc.ibcpartners.partner.entity.Commission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    @Query("""
        SELECT new hu.ibc.ibcpartners.partner.dto.CommissionDto(
                c.id, c.transactionId, c.userId, u.fullName, p.name, t.description, t.fulfillmentDate, t.amount, c.commission, c.status)
        FROM Commission c
        JOIN User u ON c.userId = u.id
        JOIN Transaction t ON c.transactionId = t.id
        JOIN Partner p ON t.sellerId = p.id
        WHERE (:userId IS NULL OR c.userId = :userId) AND (:transactionId IS NULL OR c.transactionId = :transactionId)
        """)
    Page<CommissionDto> search(Long userId, Long transactionId, Pageable pageable);
}

