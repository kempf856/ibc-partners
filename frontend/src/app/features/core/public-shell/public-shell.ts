import {Component} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-public-shell',
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss',
})
export class PublicShell {
}
