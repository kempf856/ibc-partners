package hu.ibc.ibcpartners.core.repository;

import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.entity.Setting;
import hu.ibc.ibcpartners.core.entity.SettingKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommissionSettingRepository extends JpaRepository<CommissionSetting, Long> {

    @Query("""
            SELECT cs FROM CommissionSetting cs
            WHERE COALESCE(:partnerId, -1) = COALESCE(cs.partnerId, -1) AND COALESCE(:transactionId, -1) = COALESCE(cs.transactionId, -1)
        """)
    Optional<CommissionSetting> findByIds(Long partnerId, Long transactionId);
}

