import {Component, effect, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
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
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommissionStatus, commissionStatusClass, commissionStatusLabel} from '../../../../../shared/commission-status';
import {CommissionService} from './commission-service';
import {AuthService} from '../../../../../core/auth/auth-service';
import {CommissionDto} from './commission-dto';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckbox} from '@angular/material/checkbox';
import {InvoiceService} from '../invoice/invoice-service';
import {NotificationService} from '../../../../../core/notification/notification';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

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
    MatTable,
    RouterLink,
    MatHeaderCellDef,
    DatePipe,
    MatCheckbox,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup
  ],
  templateUrl: './commission-list.html',
  styleUrl: './commission-list.scss',
})
export class CommissionList {

  protected readonly commissionStatusClass = commissionStatusClass;
  protected readonly commissionStatusLabel = commissionStatusLabel;

  commissionService = inject(CommissionService);
  invoiceService = inject(InvoiceService);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  statusFilter = new FormControl<CommissionStatus>(CommissionStatus.LISTED, { nonNullable: true });

  allCommissions = signal(0);
  billableCommissions = signal(0)

  commissions = signal<CommissionDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('transactionId,desc');

  selection = new SelectionModel<number>(true);

  constructor() {
    effect(() => {
      this.commissionService.commissionChanged();

      this.commissionService.my({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort(),
        status: this.statusFilter.value
      }).subscribe(res => {
        this.allCommissions.set(res.allCommissions);
        this.billableCommissions.set(res.billableCommissions);
        this.commissions.set(res.pageResponse.content);
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
      this.sort.set('transactionId,desc');
      return;
    }

    this.sort.set(`${event.active},${event.direction}`);
  }

  getReturnUrl(): string {
    const tree = this.router.createUrlTree([], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        tab: 1
      }
    });
    return this.router.serializeUrl(tree);
  }

  protected billSelected() {
    const selected = this.selection.selected;
    if (!selected || selected.length === 0) {
      this.notificationService.error('Nincs kiválasztott jutalék!');
      return;
    }

    this.createInvoice(selected);
  }

  protected billAll() {
    this.createInvoice([]);
  }

  private createInvoice(ids: number[]) {
    this.invoiceService.create(ids).subscribe(() => {
      this.selection.clear();
      this.refreshCommission();
      this.notificationService.success('Sikeres számlázás');
    });
  }

  protected refreshCommission() {
    this.commissionService.commissionChanged.set(!this.commissionService.commissionChanged());
  }

  protected readonly CommissionStatus = CommissionStatus;
}
