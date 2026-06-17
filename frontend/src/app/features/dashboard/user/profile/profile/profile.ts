import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../user-service';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {ReferralCode} from '../referral-code/referral-code';
import {CommissionList} from '../commissions/commission-list';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatTab,
    MatTabGroup,
    ReferralCode,
    CommissionList
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.profile()
      .subscribe(userDto => console.log('User profile:', userDto));
  }
}
