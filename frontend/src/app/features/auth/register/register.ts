import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Auth} from '../../../core/auth/auth';
import {NotificationService} from '../../../core/notification/notification';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {

  authService = inject(Auth);
  notification = inject(NotificationService)

  otp!: string;

  form = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]),
      confirmPassword: new FormControl('')
    },
    { validators: this.passwordMatchValidator }
  );

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.otp = params.get('otp')!;
    });
  }

  passwordMatchValidator(group: AbstractControl) {
    const pass = group.get('password');
    const confirm = group.get('confirmPassword');

    if (!pass || !confirm) return null;

    const mismatch = pass.value !== confirm.value;
    confirm.setErrors(mismatch ? { passwordMismatch: true } : null);

    return null;
  }

  checkRequired() {
    return this.form.get('password')?.hasError('required');
  }

  checkMinLength() {
    return !this.checkRequired() && this.form.get('password')?.hasError('minlength');
  }

  checkAllCharTypes() {
    return !this.checkMinLength() && this.form.get('password')?.hasError('pattern');
  }

  submit() {
    this.authService.register(this.otp, this.form.value.password!).subscribe(() => {
      this.notification.success('Sikeres regisztráció');
      this.router.navigate(['/login']);
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
