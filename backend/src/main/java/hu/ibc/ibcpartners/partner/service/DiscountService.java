package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.entity.CommissionSetting;
import hu.ibc.ibcpartners.core.service.CommissionSettingService;
import hu.ibc.ibcpartners.partner.entity.Discount;
import hu.ibc.ibcpartners.partner.entity.DiscountStatus;
import hu.ibc.ibcpartners.partner.entity.Transaction;
import hu.ibc.ibcpartners.partner.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final CommissionSettingService commissionSettingService;
    private final DiscountRepository discountRepository;

//    public PageResponse<CommissionDto> search(Long userId, Long transactionId, Pageable pageable) {
//        Page<CommissionDto> commissionPage = commissionRepository.search(userId, transactionId, pageable);
//        return PageResponse.of(commissionPage, Function.identity());
//    }

    @Transactional
    public void bookDiscount(Transaction transaction) {
        CommissionSetting setting = commissionSettingService.findByIds(null, transaction.getId());

        bookDiscount(transaction.getId(), transaction.getSellerId(), transaction.getBuyerId(), setting.getBuyerPercent(), transaction.getAmount());
    }

    private void bookDiscount(Long transactionId, Long sellerId, Long buyerId, Integer percent, Long amount) {
        if (percent == null) {
            return;
        }

        Discount discount = Discount.builder()
                .transactionId(transactionId)
                .buyerId(buyerId)
                .sellerId(sellerId)
                .discount(amount * percent / 100)
                .status(DiscountStatus.LISTED)
                .build();

        discountRepository.save(discount);
    }
}
