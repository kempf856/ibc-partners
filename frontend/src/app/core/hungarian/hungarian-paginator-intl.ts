import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class HungarianPaginatorIntl extends MatPaginatorIntl {

  override itemsPerPageLabel = 'Oldalméret';
  override nextPageLabel = 'Következő oldal';
  override previousPageLabel = 'Előző oldal';
  override firstPageLabel = 'Első oldal';
  override lastPageLabel = 'Utolsó oldal';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return `0 / 0`;
    }

    const start = page * pageSize;
    const end = Math.min(start + pageSize, length);

    return `${start + 1} – ${end} / ${length}`;
  };
}
