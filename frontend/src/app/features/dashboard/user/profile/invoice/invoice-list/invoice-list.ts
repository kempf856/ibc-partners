import {Component, effect, inject, input, signal} from '@angular/core';
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
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../../../core/auth/auth-service';
import {InvoiceService} from '../invoice-service';
import {InvoiceDto} from '../invoice-dto';
import {CommissionService} from '../../commission/commission-service';

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
    DatePipe,
    RouterLink
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

  userId = input<number | null>(null);

  allCommissions = signal(0);
  billableCommissions = signal(0)

  invoices = signal<InvoiceDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(10);
  pageIndex = signal(0);
  sort = signal<string>('id,desc');

  constructor() {
    effect(() => {
      this.commissionService.commissionChanged();

      this.invoiceService.search({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort()
      }, this.userId()).subscribe(res => {
        this.allCommissions.set(res.allCommissions);
        this.billableCommissions.set(res.billableCommissions);
        this.invoices.set(res.pageResponse.content);
        this.totalElements.set(res.pageResponse.totalElements);
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

  getReturnUrl(): string {
    if (this.userId()) {
      return this.router.url;
    } else {
      const tree = this.router.createUrlTree([], {
        queryParams: {
          ...this.route.snapshot.queryParams,
          tab: 1
        }
      });
      return this.router.serializeUrl(tree);
    }
  }
}
