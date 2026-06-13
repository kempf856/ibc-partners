package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.common.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

/**
 * Partner entity mapped to the `partners` table defined in V002__create_tables.sql.
 *
 * Columns in DB: id, tax_number (unique), name, headquarters, site, phone, website, activities (integer[]), audit columns...
 */
@Entity
@Table(name = "partners")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Partner extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "tax_number", unique = true, nullable = false)
    private String taxNumber;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "headquarters", nullable = false)
    private String headquarters;

    @Column(name = "site")
    private String site;

    @Column(name = "phone")
    private String phone;

    @Column(name = "website")
    private String website;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "activities", columnDefinition = "long[]", nullable = false)
    private List<Long> activities;
}