import {Component, computed, inject} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../core/notification/notification';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TransactionService} from '../transaction-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {PartnerDto} from '../../partner/partner-dto';
import {toSignal} from '@angular/core/rxjs-interop';
import {PartnerService} from '../../partner/partner-service';

@Component({
  selector: 'app-transaction-create',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatOption, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteTrigger, MatAutocomplete
  ],
  templateUrl: './transaction-create.html',
  styleUrl: './transaction-create.scss',
})
export class TransactionCreate {

  transactionService = inject(TransactionService);
  partnerService = inject(PartnerService);
  notification = inject(NotificationService);
  router = inject(Router);

  form = new FormGroup({
    sellerId: new FormControl<number>(0, { nonNullable: true }),
    buyerId: new FormControl<number>(0, { nonNullable: true }),
    invoiceNumber: new FormControl<string | null>(''),
    amount: new FormControl<number>(0, { nonNullable: true }),
    description: new FormControl<string | null>(''),
    fulfillmentDate: new FormControl<string | null>('')
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

  onSelectedSeller(partner: PartnerDto) {
    this.form.patchValue({ sellerId: partner.id });
  }

  onSelectedBuyer(partner: PartnerDto) {
    this.form.patchValue({ buyerId: partner.id });
  }

  displayPartner = (partner?: PartnerDto): string => {
    return partner ? partner.name : '';
  };

  protected save() {
    this.transactionService.createTransaction(this.form.getRawValue()).subscribe(() => {
        this.notification.success('Sikeres mentés');
        this.cancel();
      });
  }

  cancel() {
    this.router.navigate(['/transactions']);
  }
}
