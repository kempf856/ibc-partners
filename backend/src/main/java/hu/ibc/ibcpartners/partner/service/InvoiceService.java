package hu.ibc.ibcpartners.partner.service;

import hu.ibc.ibcpartners.core.dto.PageResponse;
import hu.ibc.ibcpartners.partner.dto.*;
import hu.ibc.ibcpartners.partner.entity.Commission;
import hu.ibc.ibcpartners.partner.entity.CommissionStatus;
import hu.ibc.ibcpartners.partner.entity.Invoice;
import hu.ibc.ibcpartners.partner.mapper.InvoiceMapper;
import hu.ibc.ibcpartners.partner.repository.CommissionRepository;
import hu.ibc.ibcpartners.partner.repository.InvoiceRepository;
import hu.ibc.ibcpartners.security.service.AuthHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public InvoiceSummary search(Long userId, Pageable pageable) {
        CommissionSummary commissionSummary = commissionRepository.sumCommissions(userId);
        return new InvoiceSummary(PageResponse.of(invoiceRepository.findByUserId(userId, pageable), invoiceMapper::map),
                commissionSummary.allCommissions(), commissionSummary.billableCommissions());
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
                .map(Commission::getCommission)
                .reduce(0L, Long::sum);

        Invoice invoice = Invoice.builder()
                .userId(AuthHelper.getUserId())
                .amount(sumAmount)
                .build();
        invoiceRepository.save(invoice);

        commissions.forEach(commission -> {
            commission.setStatus(CommissionStatus.ACCOUNTED);
            commission.setInvoiceId(invoice.getId());
        });
    }

    public InvoiceDto getById(Long id) {
        Invoice invoice = findById(id);
        List<CommissionDto> commissions = commissionRepository.search(invoice.getUserId(), id, null, Pageable.unpaged(Sort.by("id").descending())).getContent();
        return invoiceMapper.map(invoice, commissions);
    }

    private Invoice findById(Long id) {
        return invoiceRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Számla nem található ezzel az ID-val: " + id));
    }
}
