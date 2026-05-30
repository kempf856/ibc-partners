import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Auth} from '../../../core/auth/auth';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-app-shell',
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    RouterOutlet,
    MatIconButton,
    MatSidenavContent,
    MatSidenav,
    MatSidenavContainer,
    MatIcon
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
