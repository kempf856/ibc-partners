package hu.ibc.ibcpartners.partner.mapper;

import hu.ibc.ibcpartners.partner.dto.TransactionDto;
import hu.ibc.ibcpartners.partner.dto.TransactionRequest;
import hu.ibc.ibcpartners.partner.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    Transaction map(TransactionRequest dto);
    TransactionDto map(Transaction transaction, String sellerName, String buyerName);
    void map(TransactionRequest dto, @MappingTarget Transaction transaction);
}

