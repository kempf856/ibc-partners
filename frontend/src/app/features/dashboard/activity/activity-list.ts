import {Component, inject, OnInit} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
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
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivityDto} from './activity-dto';
import {ActivityService} from './activity-service';
import {ConfirmDialogComponent} from '../../../core/dialog/confirm-dialog-component';
import {MatDialog} from '@angular/material/dialog';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NotificationService} from '../../../core/notification/notification';

@Component({
  selector: 'app-activity-list',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
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
    MatIcon,
    MatTooltip,
    ReactiveFormsModule
  ],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
})
export class ActivityList implements OnInit {

  dataSource = new MatTableDataSource<ActivityDto>([]);
  activityService = inject(ActivityService);
  dialog = inject(MatDialog);
  notificationService = inject(NotificationService);

  totalElements = 0;

  pageSize = 20;
  pageIndex = 0;

  sort = 'activity,asc';

  activityId? : number;
  activity = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    this.activityService.search({
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
    this.loadActivities();
  }

  onSort(event: Sort) {
    this.sort = `${event.active},${event.direction}`;
    this.loadActivities();
  }

  delete(activity: ActivityDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Törlés',
        message: `Biztos törölni szeretnéd ezt a tevékenységet: ${activity.activity}?`,
        yesButton: 'Törlés'

      },
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && activity.id) {
        this.activityService.delete(activity.id).subscribe(() => {
          this.notificationService.success('Tevékenység törlése sikeres');
          this.loadActivities();
        });
      }
    });
  }

  edit(activity: ActivityDto): void {
    this.activityId = activity.id;
    this.activity.setValue(activity.activity);
  }

  save(): void {
    this.activityService.save({ id: this.activityId, activity: this.activity.value }).subscribe(() => {
      this.notificationService.success('Tevékenység mentése sikeres');
      this.activityId = undefined;
      this.activity.setValue('');
      this.activity.markAsPristine();
      this.activity.markAsUntouched();
      this.loadActivities();
    });
  }
}
