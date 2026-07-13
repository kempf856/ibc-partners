import {Component, inject, resource} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {TextFieldModule} from '@angular/cdk/text-field';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {toSignal} from '@angular/core/rxjs-interop';
import {firstValueFrom, map} from 'rxjs';
import {InvoiceService} from '../invoice-service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTableModule
} from '@angular/material/table';

@Component({
  selector: 'app-invoice-view',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TextFieldModule, CKEditorModule, DatePipe, DecimalPipe, MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTableModule
  ],
  templateUrl: './invoice-view.html',
  styleUrl: './invoice-view.scss',
})
export class InvoiceView {

  router = inject(Router)
  route = inject(ActivatedRoute);

  invoiceService = inject(InvoiceService);

  listMode = this.route.snapshot.data['mode'] as ListMode;

  readonly returnUrl = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('returnUrl') ? params.get('returnUrl') : undefined)
    )
  );

  readonly invoiceId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('invoiceId') ? Number(params.get('invoiceId')) : undefined)
    )
  );

  readonly invoice = resource({
    params: () => this.invoiceId(),
    loader: async ({ params }) => {
      if (!params) {
        return undefined;
      }
      return firstValueFrom(this.invoiceService.getById(params, this.listMode === 'admin'));
    }
  });

  cancel() {
    const returnUrl = this.returnUrl();
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/partners']);
    }
  }
}
