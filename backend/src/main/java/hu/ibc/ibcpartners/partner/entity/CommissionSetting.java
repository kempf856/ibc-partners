package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.common.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "commission_settings")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionSetting extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "partner_id", unique = true)
    private Long partnerId;

    @Column(name = "transaction_id", unique = true)
    private Long transactionId;

    @Column(name = "director1_id")
    private Long director1Id;

    @Column(name = "director1_percent")
    private Integer director1Percent;

    @Column(name = "director2_id")
    private Long director2Id;

    @Column(name = "director2_percent")
    private Integer director2Percent;

    @Column(name = "director3_id")
    private Long director3Id;

    @Column(name = "director3_percent")
    private Integer director3Percent;

    @Column(name = "referral_id")
    private Long referralId;

    @Column(name = "referral_percent")
    private Integer referralPercent;
}