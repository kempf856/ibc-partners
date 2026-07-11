package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.DiscountAccountDto;
import hu.ibc.ibcpartners.partner.entity.DiscountAccount;
import hu.ibc.ibcpartners.partner.entity.Transaction;
import hu.ibc.ibcpartners.partner.mapper.DiscountAccountMapper;
import hu.ibc.ibcpartners.partner.repository.DiscountAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class DiscountAccountService {

    private final DiscountAccountRepository discountAccountRepository;
    private final DiscountAccountMapper discountAccountMapper;

    @Transactional
    public DiscountAccountDto getByPartners(Long sellerId, Long buyerId) {
        if (sellerId.equals(buyerId)) {
            return null;
        }
        return discountAccountMapper.map(findByPartners(sellerId, buyerId));
    }

    private DiscountAccount findByPartners(Long sellerId, Long buyerId) {
        return discountAccountRepository.findBySellerIdAndBuyerId(sellerId, buyerId)
                .orElseGet(() -> discountAccountRepository.save(DiscountAccount.builder()
                        .sellerId(sellerId)
                        .buyerId(buyerId)
                        .allDiscounts(0L)
                        .availableBalance(0L)
                        .blockedBalance(0L)
                        .build()));
    }

    public PageResponse<DiscountAccountDto> search(Long sellerId, Long buyerId, Pageable pageable) {
        return PageResponse.of(discountAccountRepository.search(sellerId, buyerId, pageable), Function.identity());
    }

    public DiscountAccountDto sumDiscounts(Long sellerId, Long buyerId) {
        return discountAccountRepository.sumDiscounts(sellerId, buyerId);
    }

    @Transactional
    public void block(Transaction transaction) {
        DiscountAccount discountAccount = findByPartners(transaction.getSellerId(), transaction.getBuyerId());

        if (discountAccount.getAvailableBalance() < transaction.getDiscount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nincs ennyi felhasználható kedvezményed!");
        }

        discountAccount.setAvailableBalance(discountAccount.getAvailableBalance() - transaction.getDiscount());
        discountAccount.setBlockedBalance(discountAccount.getBlockedBalance() + transaction.getDiscount());
        discountAccountRepository.save(discountAccount);
    }

    @Transactional
    public void use(Transaction transaction) {
        DiscountAccount discountAccount = findByPartners(transaction.getSellerId(), transaction.getBuyerId());

        if (discountAccount.getBlockedBalance() < transaction.getDiscount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nincs ennyi zárolt kedvezményed!");
        }

        discountAccount.setBlockedBalance(discountAccount.getBlockedBalance() - transaction.getDiscount());
        discountAccountRepository.save(discountAccount);
    }

    @Transactional
    public void book(Long sellerId, Long buyerId, Long discount) {
        DiscountAccount discountAccount = findByPartners(sellerId, buyerId);
        discountAccount.setAllDiscounts(discountAccount.getAllDiscounts() + discount);
        discountAccount.setAvailableBalance(discountAccount.getAvailableBalance() + discount);
        discountAccountRepository.save(discountAccount);
    }
}
