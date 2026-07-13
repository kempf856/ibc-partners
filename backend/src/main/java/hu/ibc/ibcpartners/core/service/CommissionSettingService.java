package hu.ibc.ibcpartners.core.service;

import com.fasterxml.jackson.databind.JsonNode;
import hu.ibc.ibcpartners.core.dto.AuditChange;
import hu.ibc.ibcpartners.core.dto.CommissionSettingDto;
import hu.ibc.ibcpartners.core.entity.AuditEventType;
import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.mapper.CommissionSettingMapper;
import hu.ibc.ibcpartners.core.mapper.auditchange.CommissionSettingChangeResolver;
import hu.ibc.ibcpartners.core.repository.CommissionSettingRepository;
import hu.ibc.ibcpartners.notification.service.EmailService;
import hu.ibc.ibcpartners.notification.service.EmailTemplate;
import hu.ibc.ibcpartners.partner.repository.TransactionRepository;
import hu.ibc.ibcpartners.partner.service.PartnerProvider;
import hu.ibc.ibcpartners.security.entity.Role;
import hu.ibc.ibcpartners.security.repository.UserRepository;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import hu.ibc.ibcpartners.security.service.UserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommissionSettingService {

    private static final Map<String, String> FIELDS = Map.of(
            "sellerPercent", "Partneri jutalék",
            "buyerPercent", "Vevő kedvezmény",
            "director1Id", "Direktor 1",
            "director1Percent", "Direktor 1 jutalék",
            "director2Id", "Direktor 2",
            "director2Percent", "Direktor 2 jutalék",
            "director3Id", "Direktor 3",
            "director3Percent", "Direktor 3 jutalék",
            "referralId", "Üzletkötő",
            "referralPercent", "Üzletkötői jutalék"
    );

    private final CommissionSettingRepository commissionSettingRepository;
    private final CommissionSettingMapper commissionSettingMapper;
    private final AuditLogService auditLogService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final UserProvider userProvider;
    private final PartnerProvider partnerProvider;
    private final TransactionRepository transactionRepository;
    private final CommissionSettingChangeResolver commissionSettingChangeResolver;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public CommissionSettingDto getByIds(Long partnerId, Long transactionId) {
        return commissionSettingMapper.map(findByIds(partnerId, transactionId));
    }

    public CommissionSetting findByIds(Long partnerId, Long transactionId) {
        return commissionSettingRepository.findByIds(partnerId, transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jutalék beállítás nem található a partherhez [" + partnerId + "] és ügylethez [" + transactionId + "]"));
    }

    @Transactional
    public void createForPartner(Long partnerId, Long referralId) {
        CommissionSetting globalSetting = findByIds(null, null);
        CommissionSetting partnerSetting = new CommissionSetting(globalSetting);
        partnerSetting.setPartnerId(partnerId);
        partnerSetting.setReferralId(referralId);
        commissionSettingRepository.save(partnerSetting);
    }

    @Transactional
    public void createForTransaction(Long partnerId, Long transactionId) {
        CommissionSetting globalSetting = findByIds(partnerId, null);
        CommissionSetting partnerSetting = new CommissionSetting(globalSetting);
        partnerSetting.setPartnerId(null);
        partnerSetting.setTransactionId(transactionId);
        commissionSettingRepository.save(partnerSetting);
    }

    @Transactional
    public void update(CommissionSettingDto dto) {
        if (nvl(dto.director1Percent()) + nvl(dto.director2Percent()) + nvl(dto.director3Percent()) + nvl(dto.referralPercent()) +
                nvl(dto.buyerPercent()) > dto.sellerPercent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A jutalékok összege nem lehet nagyobb a Partneri jutaléknál!");
        }

        CommissionSetting setting = findByIds(dto.partnerId(), dto.transactionId());
        String commissionLevel = setting.getTransactionId() != null ? getTransactionLevel(setting.getTransactionId())
                : setting.getPartnerId() != null ? getPartnerLevel(setting.getPartnerId())
                : "DEFAULT szint";
        CommissionSettingDto beforeDto = commissionSettingMapper.map(setting);
        auditLogService.write(AuditEventType.COMMISSION_SETTING_CHANGED, beforeDto, dto, commissionLevel);
        commissionSettingMapper.map(dto, setting);
        commissionSettingRepository.save(setting);
        sendEmail(commissionLevel, beforeDto, dto);
    }

    private void sendEmail(String commissionLevel, CommissionSettingDto before, CommissionSettingDto after) {
        Map<String, Object> params = Map.of(
                "userName", userProvider.getName(AuthHelper.getUserId()),
                "commissionLevel", commissionLevel,
                "changes", formatChanges(auditLogService.createChanges(before, after)),
                "link", frontendUrl
        );
        userRepository.search(null, null, Role.ADMIN.name(), Pageable.unpaged()).getContent()
                .forEach(user -> {
                    Map<String, Object> fullParams = new HashMap<>(params);
                    fullParams.put("name", user.getFullName());
                    sendEmail(user.getEmail(), fullParams);
                });
    }

    private List<String> formatChanges(List<AuditChange> changes) {
        return commissionSettingChangeResolver.resolveChanges(changes).stream()
                .map(c -> FIELDS.getOrDefault(c.field(), c.field()) + ": " + nullValue(c.oldValue()) + " -> " + nullValue(c.newValue())).toList();
    }

    private String nullValue(String value) {
        return value == null ? "{ üres }" : value;
    }

    private String getTransactionLevel(Long transactionId) {
        return "Ügylet szint: " + transactionRepository.findById(transactionId)
                .map(t -> partnerProvider.getName(t.getSellerId()) + " - " + t.getDescription() + " (#" + t.getId() + ") ")
                .orElse("");
    }

    private String getPartnerLevel(Long partnerId) {
        return "Partner szint: " + partnerProvider.getName(partnerId);
    }

    private void sendEmail(String to, Map<String, Object> map) {
        emailService.sendEmail(to, EmailTemplate.COMMISSION_SETTING_CHANGED, map);
    }

    private int nvl(Integer percent) {
        return percent == null ? 0 : percent;
    }

    public void createDefaultSetting() {
        Optional<CommissionSetting> found = commissionSettingRepository.findByIds(null, null);
        if (found.isPresent()) {
            return;
        }

        CommissionSetting setting = new CommissionSetting();
        setting.setSellerPercent(15);
        setting.setBuyerPercent(5);
        setting.setDirector1Id(1L);
        setting.setDirector1Percent(8);
        setting.setReferralPercent(1);
        commissionSettingRepository.save(setting);
    }
}
