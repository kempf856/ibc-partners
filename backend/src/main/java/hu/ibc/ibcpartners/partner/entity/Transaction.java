package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.core.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "description")
    private String description;

    @Column(name = "fulfillment_date")
    private LocalDate fulfillmentDate;

    @Column(name = "seller_approved")
    private Instant sellerApproved;

    @Column(name = "seller_approver")
    private Long sellerApprover;

    @Column(name = "buyer_approved")
    private Instant buyerApproved;

    @Column(name = "buyer_approver")
    private Long buyerApprover;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
}