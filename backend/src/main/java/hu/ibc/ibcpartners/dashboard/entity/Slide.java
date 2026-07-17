package hu.ibc.ibcpartners.dashboard.entity;

import hu.ibc.ibcpartners.core.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "slides")
@Getter
@Setter
@ToString(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Slide extends AuditedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "slide", nullable = false)
    private String slide;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "visible_from")
    private LocalDate visibleFrom;

    @Column(name = "visible_to")
    private LocalDate visibleTo;

    @Column(name = "sort_order")
    private Long sortOrder;
}

