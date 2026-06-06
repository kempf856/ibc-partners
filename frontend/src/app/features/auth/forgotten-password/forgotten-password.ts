import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthService} from '../../../core/auth/auth-service';
import {NotificationService} from '../../../core/notification/notification';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-forgotten-password',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './forgotten-password.html',
  styleUrl: './forgotten-password.scss',
})
export class ForgottenPassword {

  authService = inject(AuthService);
  notification = inject(NotificationService)
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true })
  });

  submit() {
    this.authService.forgottenPassword(this.form.getRawValue()).subscribe(() => {
      this.notification.success('Jelszó csere e-mail elküldve');
      this.cancel();
    });
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}
