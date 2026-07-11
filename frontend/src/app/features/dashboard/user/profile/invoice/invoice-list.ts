import {Component, computed, effect, inject, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, DecimalPipe} from '@angular/common';
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
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../../core/auth/auth-service';
import {InvoiceService} from './invoice-service';
import {InvoiceDto} from './invoice-dto';
import {CommissionService} from '../commission/commission-service';

@Component({
  selector: 'app-invoice-list',
  imports: [
    ReactiveFormsModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    DecimalPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    MatHeaderCellDef,
    DatePipe
  ],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss',
})
export class InvoiceList {

  invoiceService = inject(InvoiceService);
  authService = inject(AuthService);
  commissionService = inject(CommissionService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  invoices = signal<InvoiceDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(10);
  pageIndex = signal(0);
  sort = signal<string>('id,desc');

  listMode = this.route.snapshot.data['mode'] as ListMode;

  readonly displayedColumns = computed(() => {
    const columns = [];

    if (this.listMode === 'admin') {
      columns.push('userName');
    }

    columns.push(
      'createdAt',
      'amount',
      'actions'
    );

    return columns;
  });

  constructor() {
    effect(() => {
      this.commissionService.commissionChanged();

      this.invoiceService.my({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort()
      }).subscribe(res => {
        this.invoices.set(res.content);
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
      this.sort.set('id,desc');
      return;
    }

    this.sort.set(`${event.active},${event.direction}`);
  }
}
