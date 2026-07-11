import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../user-service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {ReferralCode} from '../referral-code/referral-code';
import {CommissionList} from '../commission/commission-list';
import {DiscountAccountList} from '../discount-account/discount-account-list';
import {ActivePartnerService} from '../../../../../core/auth/active-partner-service';
import {ActivatedRoute} from '@angular/router';
import {InvoiceList} from '../invoice/invoice-list';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatTab,
    MatTabGroup,
    ReferralCode,
    CommissionList,
    DiscountAccountList,
    InvoiceList
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  protected activePartnerService = inject(ActivePartnerService);

  selectedTab = 0;

  ngOnInit(): void {
    this.userService.profile().subscribe();
    this.selectedTab = +(this.route.snapshot.queryParamMap.get('tab') ?? 0);
  }
}
