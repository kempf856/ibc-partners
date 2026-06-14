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
import {ApplicationService} from '../../application/application-service';

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
  applicationService = inject(ApplicationService);

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
  applicationId?: string;
  referralCode?: string;

  ngOnInit(): void {
    this.loadActivities();

    this.mode = this.route.snapshot.data['mode'] as Mode;
    const id = this.route.snapshot.paramMap.get('partnerId');
    if (id) {
      this.partnerService.getById(id).subscribe(partner => {
        this.form.patchValue(partner);
      });
      return;
    }

    const applicationId = this.route.snapshot.paramMap.get('applicationId');
    if (applicationId) {
      this.applicationService.getApplication(applicationId).subscribe(application => {
        this.form.patchValue({
          name: application.companyName,
          taxNumber: application.taxNumber
        });
        this.referralCode = application.referralCode;
      });
    }
  }

  save() {
    this.partnerService.save(this.form.getRawValue(), this.referralCode).subscribe(() => {
      this.notificationService.success('Sikeres mentés');
      this.cancel();
    });
  }

  cancel() {
    if (this.applicationId) {
      this.router.navigate(['/applications', this.applicationId]);
    } else {
      this.router.navigate(['/partners']);
    }
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
