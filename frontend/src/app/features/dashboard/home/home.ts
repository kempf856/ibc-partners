import {Component, inject, OnInit, signal} from '@angular/core';
import {DashboardService} from './dashboard-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  private dashboardService = inject(DashboardService);

  message = signal('');

  ngOnInit(): void {
    this.dashboardService.welcome()
      .subscribe(dto => this.message.set(dto.message));
  }
}
