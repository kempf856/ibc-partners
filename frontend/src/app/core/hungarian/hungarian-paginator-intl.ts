import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class HungarianPaginatorIntl extends MatPaginatorIntl {

  override itemsPerPageLabel = 'Oldalméret';
  override nextPageLabel = 'Következő oldal';
  override previousPageLabel = 'Előző oldal';
  override firstPageLabel = 'Első oldal';
  override lastPageLabel = 'Utolsó oldal';
}
