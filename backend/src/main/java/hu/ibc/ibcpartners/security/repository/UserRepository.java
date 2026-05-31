package hu.ibc.ibcpartners.security.repository;

import hu.ibc.ibcpartners.security.entity.Role;
import hu.ibc.ibcpartners.security.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByOneTimePassword(UUID oneTimePassword);

    @Query(value = """
        select * from users u
        where (:email is null or u.email ilike concat(:email, '%'))
            and (:fullName is null or u.full_name ilike concat(:fullName, '%'))
            and (:role is null or :role = any(u.roles))
      """, nativeQuery = true)
    Page<User> search(String email, String fullName, String role, Pageable pageable);
}