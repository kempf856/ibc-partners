import {Component, inject, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {ActivityDto} from '../../activity/activity-dto';
import {ActivityService} from '../../activity/activity-service';
import {PartnerService} from '../partner-service';
import {NotificationService} from '../../../../core/notification/notification';

type Mode = 'view' | 'edit' | 'create';

@Component({
  selector: 'app-partner-edit',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule, ReactiveFormsModule, TextFieldModule, MatOption, MatSelect
  ],
  templateUrl: './partner-edit.html',
  styleUrl: './partner-edit.scss',
})
export class PartnerEdit implements OnInit {

  router = inject(Router)
  route = inject(ActivatedRoute);

  partnerService = inject(PartnerService);
  activityService = inject(ActivityService);
  notificationService = inject(NotificationService);

  form = new FormGroup({
    id: new FormControl<number | undefined>(undefined, { nonNullable: true }),
    taxNumber: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    headquarters: new FormControl('', { nonNullable: true }),
    site: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    website: new FormControl('', { nonNullable: true }),
    activities: new FormControl<number[]>([], { nonNullable: true })
  });

  activities: ActivityDto[] = [];
  mode!: Mode;

  ngOnInit(): void {
    this.loadActivities();

    this.mode = this.route.snapshot.data['mode'] as Mode;
    const id = this.route.snapshot.paramMap.get('partnerId');
    if (id) {
      this.partnerService.getById(id).subscribe(partner => {
        this.form.patchValue(partner);
      });
    }
  }

  save() {
    this.partnerService.save(this.form.getRawValue()).subscribe(() => {
      this.notificationService.success('Sikeres mentés');
      this.cancel();
    });
  }

  cancel() {
    this.router.navigate(['/partners']);
  }

  loadActivities() {
    this.activityService.search({
      page: 0,
      size: 1000, // Adjust the size as needed
      sort: 'activity,asc'
    }).subscribe(res => {
      this.activities = res.content;
    });
  }

  readonly() {
    return this.mode === 'view';
  }

  appearance() {
    return this.readonly() ? 'fill' : 'outline';
  }

  activitiesText(activities: number[]): string {
    return activities
      .map(id => this.activities.find(a => a.id === id)?.activity)
      .join(', ');
  }
}
