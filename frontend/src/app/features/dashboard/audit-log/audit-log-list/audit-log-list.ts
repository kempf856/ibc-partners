import {Component, effect, inject, signal} from '@angular/core';
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
  MatTable
} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatFormField, MatInput} from '@angular/material/input';
import {DatePipe, DecimalPipe} from '@angular/common';
import {AuditLogService} from '../audit-log-service';
import {AuditLogDto} from '../audit-log-dto';
import {auditEventFieldLabel, AuditEventType, auditEventTypeLabel} from '../../../../shared/audit-event-type';
import {AuditChangeDto} from '../audit-change-dto';

@Component({
  selector: 'app-audit-log-list',
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
    RouterLink,
    MatFormField,
    MatInput,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './audit-log-list.html',
  styleUrl: './audit-log-list.scss',
})
export class AuditLogList {

  auditLogService = inject(AuditLogService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  auditLogs = signal<AuditLogDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('createdAt,desc');

  constructor() {
    effect(() => {
      this.auditLogService.search({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort()
      }).subscribe(res => {
        this.auditLogs.set(res.content);
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
      this.sort.set('createdAt,desc');
      return;
    }

    this.sort.set(`${event.active},${event.direction}`);
  }

  protected readonly auditEventTypeLabel = auditEventTypeLabel;

  protected changes(changes: AuditChangeDto[], eventType: AuditEventType) {
    return changes.map(change =>
      `${auditEventFieldLabel(eventType, change.field)}: ${this.nullValue(change.oldValue)} → ${this.nullValue(change.newValue)}`
    );
  }

  private nullValue(value: string | null) {
    if (value === null) {
      return '{ üres }';
    }
    return value;
  }

  protected json(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }
}
