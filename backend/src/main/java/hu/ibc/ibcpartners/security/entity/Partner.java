package hu.ibc.ibcpartners.security.entity;

import hu.ibc.ibcpartners.common.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "partner")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Partner extends AuditedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, name = "full_name")
    private String fullName;

    private String phone;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "tax_number")
    private String taxNumber;

    private String source;

    private String comment;

    @Enumerated(EnumType.STRING)
    private ApplicationState state;

    @Column(name = "sales_id")
    private Long salesId;

    @Column(name = "referral_code")
    private String referralCode;
}