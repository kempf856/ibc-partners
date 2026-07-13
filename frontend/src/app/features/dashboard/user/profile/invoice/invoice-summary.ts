import {PageResponse} from '../../../../page-response';
import {InvoiceDto} from './invoice-dto';

export interface InvoiceSummary {
  pageResponse: PageResponse<InvoiceDto>;
  allCommissions: number;
  billableCommissions: number;
}
