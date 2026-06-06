package hu.ibc.ibcpartners.security.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

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

    @Column(name = "referral_id")
    private Long referralId;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "modified_at")
    private Instant modifiedAt;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(Role::name).map(SimpleGrantedAuthority::new).toList();
    }
}