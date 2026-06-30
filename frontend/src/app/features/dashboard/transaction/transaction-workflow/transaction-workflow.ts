import {Component, computed, effect, inject, resource} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NotificationService} from '../../../../core/notification/notification';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TransactionService} from '../transaction-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {PartnerDto} from '../../partner/partner-dto';
import {toSignal} from '@angular/core/rxjs-interop';
import {PartnerService} from '../../partner/partner-service';
import {firstValueFrom, map} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {TransactionStatus, transactionStatusClass, transactionStatusLabel} from '../../../../shared/transaction-status';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-transaction-create',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatOption, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteTrigger, MatAutocomplete, MatIcon, MatTooltip, RouterLink, MatChip, MatChipSet, DatePipe
  ],
  templateUrl: './transaction-workflow.html',
  styleUrl: './transaction-workflow.scss',
})
export class TransactionWorkflow {

  protected readonly TransactionStatus = TransactionStatus;
  protected readonly transactionStatusClass = transactionStatusClass;
  protected readonly transactionStatusLabel = transactionStatusLabel;

  transactionService = inject(TransactionService);
  partnerService = inject(PartnerService);
  notification = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = new FormGroup({
    id: new FormControl<number>(0, { nonNullable: true }),
    sellerId: new FormControl<number>(0, { nonNullable: true }),
    buyerId: new FormControl<number>(0, { nonNullable: true }),
    invoiceNumber: new FormControl<string | null>(''),
    amount: new FormControl<number>(0, { nonNullable: true }),
    description: new FormControl<string | null>(''),
    fulfillmentDate: new FormControl<string | null>('')
  });

  readonly transactionId = toSignal(
    this.route.paramMap.pipe(
      map(params => (params.get('id') ? Number(params.get('id')) : undefined))
    )
  );

  readonly transactionDto = resource({
    params: () => this.transactionId(),
    loader: ({ params }) => {
      if (!params) {
        return Promise.resolve(null);
      }
      return firstValueFrom(this.transactionService.getTransaction(params));
    }
  });

  partners = toSignal(
    this.partnerService.getAll(),
    { initialValue: [] }
  );

  sellerSearch = new FormControl<string>('');
  buyerSearch = new FormControl<string>('');

  filteredSellers = computed(() => {
    const search = this.sellerSearch.value?.toLowerCase() ?? '';
    return this.partners().filter(p => p.name.toLowerCase().includes(search));
  });

  filteredBuyers = computed(() => {
    const search = this.buyerSearch.value?.toLowerCase() ?? '';
    return this.partners().filter(p => p.name.toLowerCase().includes(search));
  });

  constructor() {
    effect(() => {
      const dto = this.transactionDto.value();
      if (dto) {
        this.form.reset(dto);
        this.sellerSearch.setValue(dto.sellerName);
        this.buyerSearch.setValue(dto.buyerName);
      }
    });
  }

  onSelectedSeller(partner: PartnerDto) {
    if (partner.id) this.form.patchValue({ sellerId: partner.id });
  }

  onSelectedBuyer(partner: PartnerDto) {
    if (partner.id) this.form.patchValue({ buyerId: partner.id });
  }

  cancel() {
    this.router.navigate(['/transactions']);
  }

  protected sellerApprove() {
    this.transactionService.approveSeller(this.form.controls.id.value).subscribe(() => {
        this.notification.success('Ügylet jóváhagyva');
        this.transactionDto.reload();
      }
    );
  }

  protected buyerApprove() {
    this.transactionService.approveBuyer(this.form.controls.id.value).subscribe(() => {
        this.notification.success('Ügylet jóváhagyva');
        this.transactionDto.reload();
      }
    );
  }

  protected book() {
    this.transactionService.book(this.form.controls.id.value).subscribe(() => {
        this.notification.success('Ügylet elszámolva');
        this.transactionDto.reload();
      }
    );
  }

  sellerApproved() {
    const transactionDto = this.transactionDto.value();
    if (transactionDto && transactionDto.sellerApproved && transactionDto.sellerApproverName) {
      return transactionDto.sellerApproverName + ', ';
    }
    return '';
  }

  buyerApproved() {
    const transactionDto = this.transactionDto.value();
    if (transactionDto && transactionDto.buyerApproved && transactionDto.buyerApproverName) {
      return transactionDto.buyerApproverName + ', ';
    }
    return '';
  }
}
