package hu.ibc.ibcpartners.core.entity;

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

    public CommissionSetting(CommissionSetting commissionSetting) {
        this.id = null;
        this.partnerId = commissionSetting.getPartnerId();
        this.transactionId = commissionSetting.getTransactionId();
        this.director1Id = commissionSetting.getDirector1Id();
        this.director1Percent = commissionSetting.getDirector1Percent();
        this.director2Id = commissionSetting.getDirector2Id();
        this.director2Percent = commissionSetting.getDirector2Percent();
        this.director3Id = commissionSetting.getDirector3Id();
        this.director3Percent = commissionSetting.getDirector3Percent();
        this.referralId = commissionSetting.getReferralId();
        this.referralPercent = commissionSetting.getReferralPercent();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "partner_id", unique = true)
    private Long partnerId;

    @Column(name = "transaction_id", unique = true)
    private Long transactionId;

    @Column(name = "partner_percent")
    private Integer partnerPercent;

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