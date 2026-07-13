import {Component, inject, resource} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {firstValueFrom} from 'rxjs';
import {UserService} from '../../../user-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {CommissionList} from '../commission-list/commission-list';
import {InvoiceList} from '../../invoice/invoice-list/invoice-list';

@Component({
  selector: 'app-commission-admin',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    CommissionList,
    InvoiceList,
  ],
  templateUrl: './commission-admin.html',
  styleUrl: './commission-admin.scss',
})
export class CommissionAdmin {

  userService = inject(UserService);

  userIdControl = new FormControl<number | null>(null);

  readonly userId = toSignal(
    this.userIdControl.valueChanges,
    { initialValue: this.userIdControl.value }
  );

  readonly allUsers = resource({
    loader: () => firstValueFrom(this.userService.getAll())
  });

}
