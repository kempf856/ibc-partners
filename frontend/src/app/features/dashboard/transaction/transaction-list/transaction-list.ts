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
import {TransactionDto} from '../transaction-dto';
import {TransactionService} from '../transaction-service';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {transactionStatusClass, transactionStatusLabel} from '../../../../shared/transaction-status';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {MatFormField, MatInput} from '@angular/material/input';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-transaction-list',
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
    DecimalPipe
  ],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList {
  protected readonly transactionStatusLabel = transactionStatusLabel;
  protected readonly transactionStatusClass = transactionStatusClass;

  transactionService = inject(TransactionService);

  transactions = signal<TransactionDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('createdAt,desc');

  constructor() {
    effect(() => {
      this.transactionService.getTransactions({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort()
      }).subscribe(res => {
        this.transactions.set(res.content);
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
}
