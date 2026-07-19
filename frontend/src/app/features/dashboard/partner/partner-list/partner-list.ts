import {Component, effect, inject, signal} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
  MatTable
} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PartnerDto} from '../partner-dto';
import {PartnerService} from '../partner-service';
import {ActivityService} from '../../../core/activity/activity-service';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatCard} from '@angular/material/card';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

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
    MatTooltip,
    MatCard,
    ReactiveFormsModule
  ],
  templateUrl: './partner-list.html',
  styleUrl: './partner-list.scss',
})
export class PartnerList {

  partnerService = inject(PartnerService);
  activityService = inject(ActivityService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  readonly activities = toSignal(
    this.activityService.search({
      page: 0,
      size: 1000,
      sort: 'activity,asc'
    }).pipe(
      map(page => page.content)
    ),
    { initialValue: []}
  );

  partners = signal<PartnerDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('name,asc');

  filter = new FormControl('', { nonNullable: true });
  filterSignal = toSignal(this.filter.valueChanges, { initialValue: this.filter.value } );
  activityFilter = new FormControl<number[]>([], { nonNullable: true });
  activityFilterSignal = toSignal(this.activityFilter.valueChanges, { initialValue: this.activityFilter.value } );

  listMode = this.route.snapshot.data['mode'] as ListMode;

  constructor() {
    effect(() => {
      this.partnerService.search({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort(),
        filter: this.filterSignal(),
        browsableOnly: this.listMode === 'global',
        activities: this.activityFilterSignal()?.length > 0 ? this.activityFilterSignal() : undefined
      }).subscribe(res => {
        this.partners.set(res.content);
        this.totalElements.set(res.totalElements);
      });
    });
  }

  onPage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onSort(event: Sort) {
    this.pageIndex.set(0);

    if (!event.direction) {
      this.sort.set('name,asc');
      return;
    }

    this.sort.set(`${event.active},${event.direction}`);
  }

  activitiesText(activities: number[]): string {
    return activities
      .map(id => this.activities().find(a => a.id === id)?.activity)
      .join(', ');
  }
}
