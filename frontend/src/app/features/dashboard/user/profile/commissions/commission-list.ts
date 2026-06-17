import {Component, effect, inject, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, DecimalPipe} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {RouterLink} from '@angular/router';
import {commissionStatusClass, commissionStatusLabel} from '../../../../../shared/commission-status';
import {CommissionService} from './commission-service';
import {AuthService} from '../../../../../core/auth/auth-service';
import {CommissionDto} from './commission-dto';

@Component({
  selector: 'app-commission-list',
  imports: [
    ReactiveFormsModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    DecimalPipe,
    MatCell,
    MatCellDef,
    MatChip,
    MatChipSet,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    RouterLink,
    MatHeaderCellDef,
    DatePipe
  ],
  templateUrl: './commission-list.html',
  styleUrl: './commission-list.scss',
})
export class CommissionList {

  protected readonly commissionStatusClass = commissionStatusClass;
  protected readonly commissionStatusLabel = commissionStatusLabel;

  commissionService = inject(CommissionService);
  authService = inject(AuthService);

  commissions = signal<CommissionDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('transactionId,desc');

  constructor() {
    effect(() => {
      this.commissionService.getCommissions({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort(),
        userId: this.authService.getLoggedInUser() ?? undefined
      }).subscribe(res => {
        this.commissions.set(res.content);
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
      this.sort.set('transactionId,desc');
      return;
    }

    this.sort.set(`${event.active},${event.direction}`);
  }
}
