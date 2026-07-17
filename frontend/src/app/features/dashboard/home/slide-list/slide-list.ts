import {Component, effect, inject, signal} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {SlideDto} from '../slide-dto';
import {SlideService} from '../slide-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {ConfirmDialogComponent} from '../../../../core/dialog/confirm-dialog-component';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../../../core/notification/notification';
import {MatChip, MatChipSet} from '@angular/material/chips';

@Component({
  selector: 'app-slide-list',
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
    MatIcon,
    MatTooltip,
    DatePipe,
    RouterLink,
    MatButtonToggle,
    MatButtonToggleGroup,
    ReactiveFormsModule,
    MatChipSet,
    MatChip
  ],
  templateUrl: './slide-list.html',
  styleUrl: './slide-list.scss',
})
export class SlideList {
  slideService = inject(SlideService);
  notificationService = inject(NotificationService);
  dialog = inject(MatDialog);

  activeFilter = new FormControl<'active' | 'all'>('active');
  activeFilterSignal = toSignal(this.activeFilter.valueChanges, { initialValue: this.activeFilter.value } );
  refresh = signal(true);

  slides = signal<SlideDto[]>([]);
  totalElements = signal(0);

  pageSize = signal(20);
  pageIndex = signal(0);
  sort = signal<string>('sortOrder,asc');

  constructor() {
    effect(() => {
      this.refresh();
      this.slideService.search({
        page: this.pageIndex(),
        size: this.pageSize(),
        sort: this.sort(),
        active: this.activeFilterSignal() === 'active' ? true : undefined
      }).subscribe(res => {
        this.slides.set(res.content);
        this.totalElements.set(res.totalElements);
      });
    });
  }

  onPage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected delete(slide: SlideDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Törlés',
        message: `Biztos törölni szeretnéd ezt a diát: ${slide.description}?`

      },
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && slide.id) {
        this.slideService.delete(slide.id).subscribe(() => {
          this.refresh.set(!this.refresh());
          this.notificationService.success('Dia törlése sikeres');
        });
      }
    });
  }
}
