package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.common.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Activity lookup entity mapped to the `activities` table from V002__create_tables.sql
 */
@Entity
@Table(name = "activities")
@Getter
@Setter
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity", nullable = false)
    private String activity;
}

