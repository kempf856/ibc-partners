import {Component, inject, OnInit} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {ApplicationDto} from '../application-dto';
import {ApplicationService} from '../application-service';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {ApplicationState, applicationStateClass, applicationStateLabel} from '../../../../shared/application-state';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {AuthService} from '../../../../core/auth/auth-service';
import {Role} from '../../../../shared/role';

@Component({
  selector: 'app-application-list',
  imports: [
    FormsModule,
    MatTable,
    MatSortModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatButtonModule,
    MatChip,
    MatChipSet,
    MatIcon,
    MatTooltip,
    DatePipe,
    RouterLink,
    MatButtonToggle,
    MatButtonToggleGroup,
    ReactiveFormsModule
  ],
  templateUrl: './application-list.html',
  styleUrl: './application-list.scss',
})
export class ApplicationList implements OnInit {
  protected readonly applicationStateLabel = applicationStateLabel;
  protected readonly applicationStateClass = applicationStateClass;

  dataSource = new MatTableDataSource<ApplicationDto>([]);
  applicationService = inject(ApplicationService);
  authService = inject(AuthService);

  stateFilter = new FormControl<'live' | 'closed' | 'all'>('live');

  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  sort = 'createdAt,desc';

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.applicationService.getApplications({
      states: this.stateFilter.value === 'live' ? [ApplicationState.CREATED, ApplicationState.IN_PROGRESS]
        : this.stateFilter.value === 'closed' ? [ApplicationState.ACCEPTED, ApplicationState.DENIED] : undefined,
      page: this.pageIndex,
      size: this.pageSize,
      sort: this.sort
    }, this.authService.hasRole(Role.ADMIN)).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalElements = res.totalElements;
    });
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadApplications();
  }

  onSort(event: Sort) {
    this.sort = `${event.active},${event.direction}`;
    this.loadApplications();
  }
}
