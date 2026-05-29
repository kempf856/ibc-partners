import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {Auth} from '../../../core/auth/auth';

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

  authService = inject(Auth);

  logout() {
    this.authService.logout();
  }
}
