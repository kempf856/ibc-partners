import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../core/auth/auth-service';
import {MatCardModule, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatError, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatCardModule, MatCardHeader, MatCardTitle, MatCardContent, MatFormFieldModule, MatLabel, MatButtonModule, MatInputModule, MatError, MatIconModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  hidePassword = true;

  onLogin() {
    this.authService.login(this.username, this.password)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
