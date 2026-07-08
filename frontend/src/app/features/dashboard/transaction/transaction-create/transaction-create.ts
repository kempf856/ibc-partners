import {Component, computed, inject, resource} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../../core/notification/notification';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TransactionService} from '../transaction-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {PartnerDto} from '../../partner/partner-dto';
import {toSignal} from '@angular/core/rxjs-interop';
import {PartnerService} from '../../partner/partner-service';
import {firstValueFrom, map, startWith} from 'rxjs';
import {ActivePartnerService} from '../../../../core/auth/active-partner-service';
import {DiscountAccountService} from '../../user/profile/discount-account/discount-account-service';
import {DecimalPipe} from '@angular/common';

type TrDisplayMode = 'sell' | 'buy' | 'admin';

@Component({
  selector: 'app-transaction-create',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatOption, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteTrigger, MatAutocomplete, MatSelect, DecimalPipe
  ],
  templateUrl: './transaction-create.html',
  styleUrl: './transaction-create.scss',
})
export class TransactionCreate {

  transactionService = inject(TransactionService);
  partnerService = inject(PartnerService);
  discountAccountService = inject(DiscountAccountService);
  activePartnerService = inject(ActivePartnerService);
  notification = inject(NotificationService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  displayMode = this.route.snapshot.data['mode'] as TrDisplayMode;

  form = new FormGroup({
    sellerId: new FormControl<number>(this.displayMode === 'sell' ? this.activePartnerService.activePartnerId() ?? 0 : 0, { nonNullable: true }),
    buyerId: new FormControl<number>(this.displayMode === 'buy' ? this.activePartnerService.activePartnerId() ?? 0 : 0, { nonNullable: true }),
    invoiceNumber: new FormControl<string | null>(''),
    amount: new FormControl<number>(0, { nonNullable: true }),
    discount: new FormControl<number>(0, { nonNullable: true }),
    description: new FormControl<string | null>(''),
    fulfillmentDate: new FormControl<string | null>('')
  });

  readonly returnUrl = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('returnUrl') ? params.get('returnUrl') : undefined)
    )
  );

  partners = toSignal(
    this.partnerService.getAll(),
    { initialValue: [] }
  );

  readonly sellerId = toSignal(
    this.form.controls.sellerId.valueChanges.pipe(
      startWith(this.form.controls.sellerId.value)
    ),
    { requireSync: true }
  );

  readonly buyerId = toSignal(
    this.form.controls.buyerId.valueChanges.pipe(
      startWith(this.form.controls.buyerId.value)
    ),
    { requireSync: true }
  );

  readonly availableDiscount = resource({
    params: () => {
      const sellerId = this.sellerId();
      const buyerId = this.buyerId();

      if (sellerId === 0 || buyerId === 0) {
        return undefined;
      }

      return { sellerId, buyerId };
    },
    loader: ({ params }) => {
      if (!params) return Promise.resolve(null);
      const my = this.displayMode !== 'admin';
      return firstValueFrom(this.discountAccountService.myByPartner(params, my));
    }
  });

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
    if (partner.id) this.form.patchValue({ sellerId: partner.id });
  }

  onSelectedBuyer(partner: PartnerDto) {
    if (partner.id) this.form.patchValue({ buyerId: partner.id });
  }

  displayPartner = (partner?: PartnerDto): string => {
    return partner ? partner.name : '';
  };

  save() {
    const my = this.displayMode === 'sell' || this.displayMode === 'buy';
    this.transactionService.createTransaction(this.form.getRawValue(), my).subscribe(() => {
      this.notification.success('Sikeres mentés');
      this.cancel();
    });
  }

  cancel() {
    const returnUrl = this.returnUrl();
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/transactions']);
    }
  }
}
