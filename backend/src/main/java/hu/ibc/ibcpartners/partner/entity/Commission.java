package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.core.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "commissions")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Commission extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "transaction_id", nullable = false)
    private Long transactionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "commission", nullable = false)
    private Long commission;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private CommissionStatus status;

    @Column(name = "invoice_id")
    private Long invoiceId;
}