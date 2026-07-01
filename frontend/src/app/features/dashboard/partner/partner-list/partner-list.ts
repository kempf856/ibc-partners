import {Component, inject, OnInit} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
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
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PartnerDto} from '../partner-dto';
import {PartnerService} from '../partner-service';
import {ActivityDto} from '../../../core/activity/activity-dto';
import {ActivityService} from '../../../core/activity/activity-service';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-partner-list',
  imports: [
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
    MatSelect,
    MatOption,
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
    RouterLink,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './partner-list.html',
  styleUrl: './partner-list.scss',
})
export class PartnerList implements OnInit {

  dataSource = new MatTableDataSource<PartnerDto>([]);
  partnerService = inject(PartnerService);
  activityService = inject(ActivityService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  activities: ActivityDto[] = [];

  totalElements = 0;

  pageSize = 20;
  pageIndex = 0;

  sort = 'name,asc';

  filter = '';
  activityFilter: number[] = [];

  listMode = this.route.snapshot.data['mode'] as ListMode;

  ngOnInit() {
    this.loadActivities();
    this.loadPartners();
  }

  loadPartners() {
    this.partnerService.search({
      page: this.pageIndex,
      size: this.pageSize,
      sort: this.sort,
      filter: this.filter,
      browsableOnly: this.listMode === 'global',
      activities: this.activityFilter.length > 0 ? this.activityFilter : undefined
    }).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalElements = res.totalElements;
    });
  }

  loadActivities() {
    this.activityService.search({
      page: 0,
      size: 1000, // Adjust the size as needed
      sort: 'activity,asc'
    }).subscribe(res => {
      this.activities = res.content;
    });
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPartners();
  }

  onSort(event: Sort) {
    this.sort = `${event.active},${event.direction}`;
    this.loadPartners();
  }

  activitiesText(activities: number[]): string {
    return activities
      .map(id => this.activities.find(a => a.id === id)?.activity)
      .join(', ');
  }
}
