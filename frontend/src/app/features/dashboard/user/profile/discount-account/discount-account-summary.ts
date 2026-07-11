import {PageResponse} from '../../../../page-response';
import {DiscountAccountDto} from './discount-account-dto';

export interface DiscountAccountSummary {
  pageResponse: PageResponse<DiscountAccountDto>
  allDiscounts: number;
  availableBalance: number;
}
