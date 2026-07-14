import {Component, inject, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {ActivityService} from '../../../core/activity/activity-service';
import {PartnerService} from '../partner-service';
import {NotificationService} from '../../../../core/notification/notification';
import {ApplicationService} from '../../application/application-service';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {Bold, ClassicEditor, Heading, Italic, Link, List} from 'ckeditor5';
import hu from 'ckeditor5/translations/hu.js';
import {AuthService} from '../../../../core/auth/auth-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map, startWith} from 'rxjs';
import {ImageUpload} from '../../../core/image-upload/image-upload';
import {CityService} from '../../../core/city/city-service';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {taxNumberValidator} from '../../../../core/validator/tax-number-validator';

@Component({
  selector: 'app-partner-edit',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule, ReactiveFormsModule, TextFieldModule, MatOption, MatSelect, MatIcon, MatTooltip, RouterLink, CKEditorModule, ImageUpload, MatAutocomplete, MatAutocompleteTrigger
  ],
  templateUrl: './partner-edit.html',
  styleUrl: './partner-edit.scss',
})
export class PartnerEdit implements OnInit {

  router = inject(Router)
  route = inject(ActivatedRoute);

  partnerService = inject(PartnerService);
  activityService = inject(ActivityService);
  citiService = inject(CityService);
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
      Link
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
      'link'
    ],
    link: {
      addTargetToExternalLinks: true
    }
  };

  form = new FormGroup({
    id: new FormControl<number>(0, { nonNullable: true }),
    taxNumber: new FormControl('', { nonNullable: true, validators: taxNumberValidator() }),
    name: new FormControl('', { nonNullable: true }),
    headquarters: new FormControl('', { nonNullable: true }),
    site: new FormControl<string | null>(''),
    location: new FormControl<string | null>(''),
    contact: new FormControl<string | null>(''),
    phone: new FormControl<string | null>(''),
    email: new FormControl<string | null>(''),
    website: new FormControl<string | null>(''),
    keyWords: new FormControl<string | null>(''),
    introduction: new FormControl<string | null>('', Validators.maxLength(4000)),
    activities: new FormControl<number[]>([], { nonNullable: true }),
    photo: new FormControl<string | null>(''),
    logo: new FormControl<string | null>('')
  });

  readonly activities = toSignal(
    this.activityService.search({
      page: 0,
      size: 1000,
      sort: 'activity,asc'
    }).pipe(
      map(page => page.content)
    ),
    { initialValue: []}
  );

  readonly cities = toSignal(
    this.citiService.getAll().pipe(
      map(cities => cities.map(city => city.city))
    ),
    { initialValue: []}
  );

  readonly filteredCities = toSignal(
    this.form.controls.location.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filter = (value ?? '').toLowerCase();
        return this.cities().filter(city =>
          city.toLowerCase().includes(filter)
        );
      })
    ),
    { initialValue: this.cities() }
  );

  displayMode = this.route.snapshot.data['mode'] as DisplayMode;
  applicationId?: string;
  referralCode?: string;

  readonly returnUrl = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('returnUrl') ? params.get('returnUrl') : undefined)
    )
  );

  ngOnInit(): void {
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
          taxNumber: application.taxNumber,
          phone: application.phone,
          email: application.email,
          contact: application.fullName
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
    const returnUrl = this.returnUrl();
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/partners']);
    }
  }
}
