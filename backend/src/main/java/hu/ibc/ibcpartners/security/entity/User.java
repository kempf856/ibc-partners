package hu.ibc.ibcpartners.security.entity;

import hu.ibc.ibcpartners.core.entity.AuditedEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString(exclude = "password", callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends AuditedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, name = "password_hash")
    private String password;

    @Column(nullable = false, name = "full_name")
    private String fullName;

    private String phone;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Enumerated(EnumType.STRING)
    private List<Role> roles;

    @Column(name = "one_time_password")
    private UUID oneTimePassword;

    @Column(name = "referral_code")
    private String referralCode;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(Role::name).map(SimpleGrantedAuthority::new).toList();
    }
}