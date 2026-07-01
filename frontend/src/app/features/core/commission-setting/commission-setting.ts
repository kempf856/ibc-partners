import {Component, computed, effect, inject, resource} from '@angular/core';
import {MatSortModule} from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NotificationService} from '../../../core/notification/notification';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {firstValueFrom, map} from 'rxjs';
import {CommissionSettingService} from './commission-setting-service';
import {UserService} from '../../dashboard/user/user-service';
import {Role} from '../../../shared/role';
import {MatOption, MatSelect} from '@angular/material/select';
import {PartnerService} from '../../dashboard/partner/partner-service';
import {TransactionService} from '../../dashboard/transaction/transaction-service';

@Component({
  selector: 'app-commission-setting',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatSortModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './commission-setting.html',
  styleUrl: './commission-setting.scss',
})
export class CommissionSetting {

  commissionSettingService = inject(CommissionSettingService);
  userService = inject(UserService);
  partnerService = inject(PartnerService);
  transactionService = inject(TransactionService);
  notification = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = new FormGroup({
    id: new FormControl<number>(0, { nonNullable: true }),
    partnerId: new FormControl<number | null>(null),
    transactionId: new FormControl<number | null>(null),
    sellerPercent: new FormControl<number>(15, { nonNullable: true }),
    buyerPercent: new FormControl<number | null>(null),
    director1Id: new FormControl<number | null>(null),
    director1Percent: new FormControl<number | null>(null),
    director2Id: new FormControl<number | null>(null),
    director2Percent: new FormControl<number | null>(null),
    director3Id: new FormControl<number | null>(null),
    director3Percent: new FormControl<number | null>(null),
    referralId: new FormControl<number | null>(null),
    referralPercent: new FormControl<number | null>(null)
  });

  readonly routeParams = toSignal(
    this.route.queryParamMap.pipe(
      map(params => ({
        partnerId: params.get('partnerId') ? Number(params.get('partnerId')) : undefined,
        transactionId: params.get('transactionId') ? Number(params.get('transactionId')) : undefined,
      }))
    )
  );

  readonly commissionSetting = resource({
    params: () => this.routeParams(),
    loader: ({ params }) =>
      firstValueFrom(this.commissionSettingService.search(params.partnerId, params.transactionId))
  });

  partner = resource({
    params: () => this.commissionSetting.value()?.partnerId,
    loader: ({ params }) => {
      if (!params) return Promise.resolve(null);
      return firstValueFrom(this.partnerService.getById(params));
    }
  });

  transaction = resource({
    params: () => this.commissionSetting.value()?.transactionId,
    loader: ({ params }) => {
      if (!params) return Promise.resolve(null);
      return firstValueFrom(this.transactionService.getTransaction(params));
    }
  });

  commissionLevel = computed(() => {
    const setting = this.commissionSetting.value();

    if (!setting) return '';
    if (setting.transactionId) return `Ügylet: ${this.transaction.value()?.description}`;
    if (setting.partnerId) {
      return `Partner: ${this.partner.value()?.name ?? '...'}`;
    }
    return 'DEFAULT';
  });

  readonly admins = resource({
    loader: () => firstValueFrom(this.userService.getAll(Role.ADMIN.valueOf()))
  });

  readonly allUsers = resource({
    loader: () => firstValueFrom(this.userService.getAll())
  });

  constructor() {
    effect(() => {
      const dto = this.commissionSetting.value();
      if (dto) {
        this.form.reset(dto);
      }
    });
  }

  save() {
    this.commissionSettingService.save(this.form.getRawValue()).subscribe(() => {
      this.notification.success('Sikeres mentés');
      this.cancel();
    });
  }

  cancel() {
    const transactionId = this.routeParams()?.transactionId;
    if (transactionId) {
      this.router.navigate(['/transactions', transactionId]);
      return;
    }
    const partnerId = this.routeParams()?.partnerId;
    if (partnerId) {
      this.router.navigate(['/partners/edit', partnerId], {
        queryParams: {
          returnUrl: this.router.url
        }
      });
      return;
    }
    this.router.navigate(['/dashboard']);
  }

  protected countCommission() {
    return (this.form.controls.director1Percent.value ?? 0) + (this.form.controls.director2Percent.value ?? 0) +
      (this.form.controls.director3Percent.value ?? 0) + (this.form.controls.referralPercent.value ?? 0) +
      (this.form.controls.buyerPercent.value ?? 0);
  }
}
