import {Component, inject} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../core/notification/notification';
import {AuthService} from '../../../core/auth/auth-service';
import {ApplicationRequest} from './application-request';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {taxNumberValidator} from '../../../core/validator/tax-number-validator';

@Component({
  selector: 'app-applicant',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule, ReactiveFormsModule
  ],
  templateUrl: './application.html',
  styleUrl: './application.scss',
})
export class Application {

  notification = inject(NotificationService);
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    fullName: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    companyName: new FormControl('', { nonNullable: true }),
    taxNumber: new FormControl('', { nonNullable: true, validators: taxNumberValidator() }),
    source: new FormControl('', { nonNullable: true })
  });
  readonly email = this.form.controls.email;

  readonly referralCode = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map(params => params.get('referralCode'))
    )
  );

  save() {
    const request: ApplicationRequest = {
      ...this.form.getRawValue(),
      referralCode: this.referralCode() ?? undefined
    };
    this.authService.application(request).subscribe(() => {
      this.notification.success('Regisztrációs kérés sikeresen rögzítve');
      this.cancel();
    });
  }

  cancel() {
    this.router.navigate(['/public/login']);
  }
}
