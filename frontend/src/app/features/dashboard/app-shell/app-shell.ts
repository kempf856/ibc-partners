import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../core/auth/auth-service';
import {Role} from '../../../shared/role';

@Component({
  selector: 'app-app-shell',
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {

  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }

  protected readonly Role = Role;
}
