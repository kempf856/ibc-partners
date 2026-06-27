import {Component, inject, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {ActivityDto} from '../../../core/activity/activity-dto';
import {ActivityService} from '../../../core/activity/activity-service';
import {PartnerService} from '../partner-service';
import {NotificationService} from '../../../../core/notification/notification';
import {ApplicationService} from '../../application/application-service';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Italic,
  Heading,
  List,
  Link,
  Image,
  ImageToolbar,
  ImageInsert,
  SimpleUploadAdapter
} from 'ckeditor5';
import hu from 'ckeditor5/translations/hu.js';
import {AuthService} from '../../../../core/auth/auth-service';

@Component({
  selector: 'app-partner-edit',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule, ReactiveFormsModule, TextFieldModule, MatOption, MatSelect, MatIcon, MatTooltip, RouterLink, CKEditorModule
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
  authService = inject(AuthService);

  public editor = ClassicEditor;
  public config = {
    licenseKey: 'GPL',
    language: {
      ui: 'hu',
      content: 'hu'
    },
    translations: [ hu ],
    simpleUpload: {
      uploadUrl: '/api/files',
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    },
    plugins: [
      Bold,
      Italic,
      Heading,
      List,
      Link,
      Image,
      ImageToolbar,
      ImageInsert,
      SimpleUploadAdapter
    ],
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'link',
      'insertImage'
    ],
    link: {
      addTargetToExternalLinks: true
    }
  };

  form = new FormGroup({
    id: new FormControl<number>(0, { nonNullable: true }),
    taxNumber: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    headquarters: new FormControl('', { nonNullable: true }),
    site: new FormControl<string | null>(''),
    phone: new FormControl<string | null>(''),
    website: new FormControl<string | null>(''),
    keyWords: new FormControl<string | null>(''),
    introduction: new FormControl<string | null>(''),
    activities: new FormControl<number[]>([], { nonNullable: true })
  });

  activities: ActivityDto[] = [];
  displayMode = this.route.snapshot.data['mode'] as DisplayMode;
  applicationId?: string;
  referralCode?: string;

  ngOnInit(): void {
    this.loadActivities();

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
    return this.displayMode === 'view';
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
