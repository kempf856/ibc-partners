package hu.ibc.ibcpartners.partner.mapper;

import hu.ibc.ibcpartners.partner.dto.CommissionDto;
import hu.ibc.ibcpartners.partner.dto.InvoiceDto;
import hu.ibc.ibcpartners.partner.entity.Invoice;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    InvoiceDto map(Invoice entity);
    InvoiceDto map(Invoice entity, List<CommissionDto> commissions);
}
