package hu.ibc.ibcpartners.security.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, name = "password_hash")
    private String password;

    @Column(nullable = false, name = "full_name")
    private String fullName;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Enumerated(EnumType.STRING)
    private List<Role> roles;

    @Column(name = "one_time_password")
    private UUID oneTimePassword;

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(Role::name).map(SimpleGrantedAuthority::new).toList();
    }
}