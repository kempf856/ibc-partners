import {Component, effect, inject} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SlideService} from '../slide-service';
import {NotificationService} from '../../../../core/notification/notification';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {transactionStatusClass, transactionStatusLabel} from '../../../../shared/transaction-status';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {ImageUpload} from '../../../core/image-upload/image-upload';

@Component({
  selector: 'app-slide-edit',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule, ReactiveFormsModule, MatSlideToggle, MatDatepicker, MatDatepickerInput, MatDatepickerToggle, ImageUpload
  ],
  templateUrl: './slide-edit.html',
  styleUrl: './slide-edit.scss',
})
export class SlideEdit {

  slideService = inject(SlideService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = new FormGroup({
    id: new FormControl<number>(0, { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    slide: new FormControl('', { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
    visibleFrom: new FormControl<string | null>(''),
    visibleTo: new FormControl<string | null>(''),
    sortOrder: new FormControl<number | null>(null),
  });

  displayMode = this.route.snapshot.data['mode'] as DisplayMode;

  readonly slideId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id),
      map(id => Number(id))
    )
  );

  constructor() {
    effect(() => {
      const id = this.slideId();
      if (!id) return;

      this.slideService.getById(id).subscribe(slide => {
        this.form.patchValue(slide);
      });
    });
  }

  cancel() {
    this.router.navigate(['/slides']);
  }

  readonly() {
    return this.displayMode === 'view';
  }

  appearance() {
    return this.readonly() ? 'fill' : 'outline';
  }

  protected save() {
    this.slideService.save(this.form.getRawValue()).subscribe(() => {
      this.notificationService.success('Sikeres mentés');
      this.cancel();
    });
  }

  protected readonly transactionStatusClass = transactionStatusClass;
  protected readonly transactionStatusLabel = transactionStatusLabel;
}
