package hu.ibc.ibcpartners.partner.entity;

import hu.ibc.ibcpartners.core.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.UUID;

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

    private String site;

    private String location;

    private String contact;

    private String phone;

    private String email;

    private String website;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "activities", columnDefinition = "long[]", nullable = false)
    private List<Long> activities;

    @Column(name = "referral_id")
    private Long referralId;

    @Column(name = "key_words")
    private String keyWords;

    private String introduction;

    private String photo;

    private String logo;
}