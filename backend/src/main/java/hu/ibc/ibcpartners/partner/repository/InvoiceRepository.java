package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Page<Invoice> findByUserId(Long userId, Pageable pageable);

    @Query("""
        SELECT i FROM Invoice i JOIN User u ON i.userId = u.id WHERE :userName IS NULL OR u.fullName ilike %:userName%
        """)
    Page<Invoice> findByUserName(String userName, Pageable pageable);
}

