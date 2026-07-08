package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.core.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "discount_accounts")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountAccount extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "all_discounts", nullable = false)
    private Long allDiscounts;

    @Column(name = "available_balance", nullable = false)
    private Long availableBalance;

    @Column(name = "blocked_balance", nullable = false)
    private Long blockedBalance;
}