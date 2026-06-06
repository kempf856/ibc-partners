import {Component, inject, OnInit} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {FormsModule} from '@angular/forms';
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
import {applicationStateLabel} from '../../../../shared/application-state';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

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
    RouterLink
  ],
  templateUrl: './application-list.html',
  styleUrl: './application-list.scss',
})
export class ApplicationList implements OnInit {
  protected readonly applicationStateLabel = applicationStateLabel;

  dataSource = new MatTableDataSource<ApplicationDto>([]);
  applicationService = inject(ApplicationService);

  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  sort = 'createdAt,desc';

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.applicationService.getApplications({
      page: this.pageIndex,
      size: this.pageSize,
      sort: this.sort
    }).subscribe(res => {
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
