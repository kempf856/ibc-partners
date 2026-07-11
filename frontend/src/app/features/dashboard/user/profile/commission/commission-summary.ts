import {PageResponse} from '../../../../page-response';
import {CommissionDto} from './commission-dto';

export interface CommissionSummary {
  pageResponse: PageResponse<CommissionDto>;
  allCommissions: number;
  billableCommissions: number;
}
