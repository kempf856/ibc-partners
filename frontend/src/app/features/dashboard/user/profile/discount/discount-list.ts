import {Component, computed, effect, inject, input, signal} from '@angular/core';
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
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {discountStatusClass, discountStatusLabel} from '../../../../../shared/discount-status';
import {DiscountService} from './discount-service';
import {AuthService} from '../../../../../core/auth/auth-service';
import {DiscountDto} from './discount-dto';

@Component({
  selector: 'app-discount-list',
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
    DatePipe
  ],
  templateUrl: './discount-list.html',
  styleUrl: './discount-list.scss',
})
export class DiscountList {

  protected readonly discountStatusClass = discountStatusClass;
  protected readonly discountStatusLabel = discountStatusLabel;

  discountService = inject(DiscountService);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  sellerId = input<number | null>(null);
  buyerId = input<number | null>(null);

  readonly displayedColumns = computed(() => {
    const columns = [];

    if (this.sellerId() === null) {
      columns.push('sellerName');
    }

    if (this.buyerId() === null) {
      columns.push('buyerName');
    }

    columns.push(
      'description',
      'fulfillmentDate',
      'amount',
      'discount',
      'status',
      'actions'
    );

    return columns;
  });

  discounts = signal<DiscountDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('transactionId,desc');

  constructor() {
    effect(() => {
      this.discountService.my({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort(),
        buyerId: this.buyerId(),
        sellerId: this.sellerId()
      }).subscribe(res => {
        this.discounts.set(res.content);
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

  getReturnUrl(): string {
    const tree = this.router.createUrlTree([], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        tab: 2
      }
    });
    return this.router.serializeUrl(tree);
  }
}
