package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.notification.service.EmailService;
import hu.ibc.ibcpartners.notification.service.EmailTemplate;
import hu.ibc.ibcpartners.partner.dto.TransactionDto;
import hu.ibc.ibcpartners.partner.dto.TransactionRequest;
import hu.ibc.ibcpartners.partner.entity.Transaction;
import hu.ibc.ibcpartners.partner.entity.TransactionStatus;
import hu.ibc.ibcpartners.partner.mapper.TransactionMapper;
import hu.ibc.ibcpartners.partner.repository.TransactionRepository;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import hu.ibc.ibcpartners.security.service.UserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final PartnerProvider partnerProvider;
    private final UserProvider userProvider;
    private final CommissionSettingService commissionSettingService;
    private final CommissionService commissionService;
    private final DiscountService discountService;
    private final PartnerMembershipService partnerMembershipService;
    private final EmailService emailService;
    private final DiscountAccountService discountAccountService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public void createMy(TransactionRequest transactionRequest) {
        if (!partnerMembershipService.hasMembership(transactionRequest.buyerId()) && !partnerMembershipService.hasMembership(transactionRequest.sellerId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nincs jogod ügyletet létrehozni ezekhez a partnerekhez!");
        }

        create(transactionRequest);
    }

    @Transactional
    public void create(TransactionRequest transactionRequest) {
        if (transactionRequest.sellerId().equals(transactionRequest.buyerId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Az eladó és a vevő nem lehet ugyanaz a partner!");
        }

        if (transactionRequest.amount() * 30 / 100 < transactionRequest.discount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A felhasznált kedvezmény nem lehet nagyobb, mint az ügylet összegének 30%-a!");
        }

        Transaction transaction = transactionMapper.map(transactionRequest);
        transaction.setStatus(TransactionStatus.PENDING);
        transactionRepository.save(transaction);

        commissionSettingService.createForTransaction(transaction.getSellerId(), transaction.getId());
        discountAccountService.block(transaction);
    }

    @Transactional
    public void sellerApprove(Long transactionId, boolean my) {
        Transaction transaction = findById(transactionId);
        if (my) {
            partnerMembershipService.checkMembership(transaction.getSellerId());
        }
        transaction.setSellerApproved(Instant.now());
        transaction.setSellerApprover(AuthHelper.getUserId());
        if (transaction.getBuyerApproved() == null) {
            partnerMembershipService.findByIds(null, transaction.getBuyerId()).forEach(pm -> {
                emailService.sendEmail(userProvider.getEmail(pm.userId()), EmailTemplate.SELLER_APPROVAL, Map.of(
                        "userName", pm.userName(),
                        "partnerName", partnerProvider.getName(transaction.getSellerId()),
                        "description", transaction.getDescription(),
                        "link", frontendUrl));
            });
        } else {
            transaction.setStatus(TransactionStatus.APPROVED);
        }
        transactionRepository.save(transaction);
    }

    @Transactional
    public void buyerApprove(Long transactionId, boolean my) {
        Transaction transaction = findById(transactionId);
        if (my) {
            partnerMembershipService.checkMembership(transaction.getBuyerId());
        }
        transaction.setBuyerApproved(Instant.now());
        transaction.setBuyerApprover(AuthHelper.getUserId());
        if (transaction.getSellerApproved() == null) {
            partnerMembershipService.findByIds(null, transaction.getSellerId()).forEach(pm -> {
                emailService.sendEmail(userProvider.getEmail(pm.userId()), EmailTemplate.BUYER_APPROVAL, Map.of(
                        "userName", pm.userName(),
                        "partnerName", partnerProvider.getName(transaction.getBuyerId()),
                        "description", transaction.getDescription(),
                        "link", frontendUrl));
            });
        } else {
            transaction.setStatus(TransactionStatus.APPROVED);
        }
        transactionRepository.save(transaction);
    }

    @Transactional
    public void book(Long transactionId) {
        Transaction transaction = findById(transactionId);
        commissionService.bookCommission(transactionId, transaction.getAmount());
        discountService.bookDiscount(transaction);
        discountAccountService.use(transaction);
        transaction.setStatus(TransactionStatus.ACCOUNTED);
        transactionRepository.save(transaction);
    }

    public Transaction findById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ügylet nem található ezzel az ID-val: " + transactionId));
    }

    public TransactionDto getById(Long transactionId) {
        return map(findById(transactionId));
    }

    public TransactionDto getMyById(Long transactionId) {
        Transaction transaction = findById(transactionId);
        if (!partnerMembershipService.hasMembership(transaction.getSellerId()) && !partnerMembershipService.hasMembership(transaction.getBuyerId())) {
            CommissionSetting commissionSetting = commissionSettingService.findByIds(null, transactionId);
            if (!AuthHelper.getUserId().equals(commissionSetting.getReferralId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nincs jogod az ügylet megtekintéséhez!");
            }
        }

        return map(transaction);
    }

    public PageResponse<TransactionDto> search(Long partnerId, Pageable pageable) {
        Page<Transaction> page = transactionRepository.search(partnerId, pageable);
        return PageResponse.of(page, this::map);
    }

    private TransactionDto map(Transaction t) {
        return transactionMapper.map(t, partnerProvider.getName(t.getSellerId()), partnerProvider.getName(t.getBuyerId()),
                userProvider.getName(t.getSellerApprover()), userProvider.getName(t.getBuyerApprover()));
    }
}
