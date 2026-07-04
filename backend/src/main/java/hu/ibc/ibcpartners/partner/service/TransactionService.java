package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.partner.dto.TransactionDto;
import hu.ibc.ibcpartners.partner.dto.TransactionRequest;
import hu.ibc.ibcpartners.partner.entity.Transaction;
import hu.ibc.ibcpartners.partner.entity.TransactionStatus;
import hu.ibc.ibcpartners.partner.mapper.TransactionMapper;
import hu.ibc.ibcpartners.partner.repository.TransactionRepository;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import hu.ibc.ibcpartners.security.service.UserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

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

    public void create(TransactionRequest transactionRequest) {
        Transaction transaction = transactionMapper.map(transactionRequest);
        transaction.setStatus(TransactionStatus.PENDING);
        transactionRepository.save(transaction);

        commissionSettingService.createForTransaction(transaction.getSellerId(), transaction.getId());
    }

    @Transactional
    public void sellerApprove(Long transactionId) {
        Transaction transaction = findById(transactionId);
        transaction.setSellerApproved(Instant.now());
        transaction.setSellerApprover(AuthHelper.getUserId());
        if (transaction.getBuyerApproved() != null) {
            transaction.setStatus(TransactionStatus.APPROVED);
        }
        transactionRepository.save(transaction);
    }

    @Transactional
    public void buyerApprove(Long transactionId) {
        Transaction transaction = findById(transactionId);
        transaction.setBuyerApproved(Instant.now());
        transaction.setBuyerApprover(AuthHelper.getUserId());
        if (transaction.getSellerApproved() != null) {
            transaction.setStatus(TransactionStatus.APPROVED);
        }
        transactionRepository.save(transaction);
    }

    @Transactional
    public void book(Long transactionId) {
        Transaction transaction = findById(transactionId);
        commissionService.bookCommission(transactionId, transaction.getAmount());
        discountService.bookDiscount(transaction);
        transaction.setStatus(TransactionStatus.ACCOUNTED);
        transactionRepository.save(transaction);
    }

    private Transaction findById(Long transactionId) {
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
