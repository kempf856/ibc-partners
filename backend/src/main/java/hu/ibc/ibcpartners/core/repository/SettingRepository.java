package hu.ibc.ibcpartners.core.repository;

import hu.ibc.ibcpartners.core.entity.Setting;
import hu.ibc.ibcpartners.core.entity.SettingKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {

    Optional<Setting> findByKey(SettingKey key);
}

