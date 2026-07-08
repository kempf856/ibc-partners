import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
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
import {DiscountAccountService} from './discount-account-service';
import {DiscountAccountDto} from './discount-account-dto';

@Component({
  selector: 'app-discount-account-list',
  imports: [
    ReactiveFormsModule,
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
    MatHeaderCellDef
  ],
  templateUrl: './discount-account-list.html',
  styleUrl: './discount-account-list.scss',
})
export class DiscountAccountList {

  discountAccountService = inject(DiscountAccountService);
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
      'allDiscounts',
      'availableBalance',
      'blockedBalance',
      'allUsedDiscounts'
    );

    return columns;
  });

  discounts = signal<DiscountAccountDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('availableBalance,desc');

  constructor() {
    effect(() => {
      this.discountAccountService.my({
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
      this.sort.set('availableBalance,desc');
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
