package hu.ibc.ibcpartners.partner.repository;

import hu.ibc.ibcpartners.partner.dto.DiscountAccountDto;
import hu.ibc.ibcpartners.partner.dto.DiscountDto;
import hu.ibc.ibcpartners.partner.entity.DiscountAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscountAccountRepository extends JpaRepository<DiscountAccount, Long> {

    Optional<DiscountAccount> findBySellerIdAndBuyerId(Long sellerId, Long buyerId);

    @Query("""
        SELECT new hu.ibc.ibcpartners.partner.dto.DiscountAccountDto(
                da.id, da.sellerId, da.buyerId, ps.name, pb.name, da.allDiscounts, da.availableBalance, da.blockedBalance)
        FROM DiscountAccount da
        JOIN Partner ps ON ps.id = da.sellerId
        JOIN Partner pb ON pb.id = da.buyerId
        WHERE (:buyerId IS NULL OR da.buyerId = :buyerId) AND (:sellerId IS NULL OR da.sellerId = :sellerId)
        """)
    Page<DiscountAccountDto> search(Long sellerId, Long buyerId, Pageable pageable);

}

