package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.dto.CommissionDto;
import hu.ibc.ibcpartners.partner.dto.CommissionSummary;
import hu.ibc.ibcpartners.partner.entity.Commission;
import hu.ibc.ibcpartners.partner.entity.CommissionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    @Query("""
        SELECT new hu.ibc.ibcpartners.partner.dto.CommissionDto(
            c.id, c.transactionId, c.userId, u.fullName, p.name, t.description, t.fulfillmentDate, t.amount, c.commission, c.status)
        FROM Commission c
        JOIN User u ON c.userId = u.id
        JOIN Transaction t ON c.transactionId = t.id
        JOIN Partner p ON t.sellerId = p.id
        WHERE (:userId IS NULL OR c.userId = :userId) AND (:invoiceId IS NULL OR c.invoiceId = :invoiceId) AND (:status IS NULL OR c.status = :status)
        """)
    Page<CommissionDto> search(Long userId, Long invoiceId, CommissionStatus status, Pageable pageable);

    @Query("""
        SELECT new hu.ibc.ibcpartners.partner.dto.CommissionSummary(null, COALESCE(SUM(c.commission), 0),
            COALESCE(SUM(CASE WHEN c.status = hu.ibc.ibcpartners.partner.entity.CommissionStatus.LISTED THEN c.commission ELSE 0 END), 0))
        FROM Commission c WHERE c.userId = :userId
        """)
    CommissionSummary sumCommissions(Long userId);

    List<Commission> findByUserIdAndStatus(Long userId, CommissionStatus status);

    List<Commission> findByIdInAndUserIdAndStatus(List<Long> ids, Long userId, CommissionStatus status);
}

