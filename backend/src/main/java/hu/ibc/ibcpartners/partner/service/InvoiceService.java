package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.InvoiceDto;
import hu.ibc.ibcpartners.partner.dto.InvoiceRequest;
import hu.ibc.ibcpartners.partner.entity.Commission;
import hu.ibc.ibcpartners.partner.entity.CommissionStatus;
import hu.ibc.ibcpartners.partner.entity.Invoice;
import hu.ibc.ibcpartners.partner.mapper.InvoiceMapper;
import hu.ibc.ibcpartners.partner.repository.CommissionRepository;
import hu.ibc.ibcpartners.partner.repository.InvoiceRepository;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CommissionRepository commissionRepository;
    private final InvoiceMapper invoiceMapper;

    public PageResponse<InvoiceDto> my(Pageable pageable) {
        return PageResponse.of(invoiceRepository.findByUserId(AuthHelper.getUserId(), pageable), invoiceMapper::map);
    }

    public PageResponse<InvoiceDto> search(String userName, Pageable pageable) {
        return PageResponse.of(invoiceRepository.findByUserName(userName, pageable), invoiceMapper::map);
    }

    @Transactional
    public void create(InvoiceRequest invoiceRequest) {
        List<Commission> commissions;
        if (invoiceRequest.commissionIds() == null || invoiceRequest.commissionIds().isEmpty()) {
            commissions = commissionRepository.findByUserIdAndStatus(AuthHelper.getUserId(), CommissionStatus.LISTED);
        } else {
            commissions = commissionRepository.findByIdInAndUserIdAndStatus(invoiceRequest.commissionIds(), AuthHelper.getUserId(), CommissionStatus.LISTED);
        }

        if (commissions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nincs számlázható jutalék!");
        }

        Long sumAmount = commissions.stream()
                .peek(commission -> commission.setStatus(CommissionStatus.ACCOUNTED))
                .map(Commission::getCommission)
                .reduce(0L, Long::sum);

        Invoice invoice = Invoice.builder()
                .userId(AuthHelper.getUserId())
                .amount(sumAmount)
                .build();
        invoiceRepository.save(invoice);
    }
}
