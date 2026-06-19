import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../core/auth/auth-service';
import {Role} from '../../../shared/role';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatDivider} from '@angular/material/list';
import {ActivePartnerService} from '../../../core/auth/active-partner-service';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatFormField, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-app-shell',
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    RouterOutlet,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem, MatSelect, MatOption, MatLabel, MatFormField
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {

  authService = inject(AuthService);
  activePartnerService = inject(ActivePartnerService)

  logout() {
    this.authService.logout();
  }

  protected readonly Role = Role;
}
