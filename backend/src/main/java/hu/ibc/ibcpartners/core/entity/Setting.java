package hu.ibc.ibcpartners.core.entity;

import hu.ibc.ibcpartners.common.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "settings")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Setting extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "key", unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    private SettingKey key;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "value")
    private String value;
}