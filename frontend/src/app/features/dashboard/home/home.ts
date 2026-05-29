import {Component, inject, OnInit, signal} from '@angular/core';
import {Dashboard} from '../dashboard';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  private dashboardService = inject(Dashboard);

  message = signal('');

  ngOnInit(): void {
    this.dashboardService.welcome()
      .subscribe(message => this.message.set(message));
  }
}
