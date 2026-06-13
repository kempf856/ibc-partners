package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.common.entity.AuditedEntity;
import hu.ibc.ibcpartners.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * Represents membership of a `User` in a `Partner` with a role (OWNER or EMPLOYEE).
 * Mapped to `partner_memberships` table defined in V002__create_tables.sql.
 */
@Entity
@Table(name = "partner_memberships")
@Getter
@Setter
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerMembership extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
    @Column(name = "user_id", nullable = false)
    private Long userId;

//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "partner_id", nullable = false)
//    private Partner partner;

    @Column(name = "partner_id", nullable = false)
    private Long partnerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private PartnerMembershipRole role;
}

