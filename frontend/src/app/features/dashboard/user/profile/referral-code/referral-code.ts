import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../user-service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-referral-code',
  imports: [
    ReactiveFormsModule,
    MatTooltip,
    MatIcon
  ],
  templateUrl: './referral-code.html',
  styleUrl: './referral-code.scss',
})
export class ReferralCode implements OnInit {

  private userService = inject(UserService);

  referralCode = signal('');
  fullUrl = computed(() =>
    `${window.location.origin}/public/applicant/${this.referralCode()}`
  );
  shortUrl = computed(() =>
    `${window.location.origin}/.../${this.referralCode()}`
  );
  qrUrl = computed(() =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.fullUrl())}`
  );

  ngOnInit(): void {
    this.userService.profile()
      .subscribe(userDto => this.referralCode.set(userDto.referralCode ?? 'nincs'));
  }

  copyUrl() {
    navigator.clipboard.writeText(this.fullUrl());
  }
}
