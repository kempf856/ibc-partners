import {Component, inject, resource} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';
import {TextFieldModule} from '@angular/cdk/text-field';
import {ActivityService} from '../../../core/activity/activity-service';
import {PartnerService} from '../partner-service';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {AuthService} from '../../../../core/auth/auth-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {firstValueFrom, map} from 'rxjs';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {Role} from '../../../../shared/role';
import {membershipLabel} from '../../../../shared/partner-membership-role';
import {MatChip} from '@angular/material/chips';

@Component({
  selector: 'app-partner-view',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TextFieldModule, CKEditorModule, MatCard, MatIcon, MatChip
  ],
  templateUrl: './partner-view.html',
  styleUrl: './partner-view.scss',
})
export class PartnerView {

  router = inject(Router)
  route = inject(ActivatedRoute);

  partnerService = inject(PartnerService);
  activityService = inject(ActivityService);
  authService = inject(AuthService);

  readonly returnUrl = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('returnUrl') ? params.get('returnUrl') : undefined)
    )
  );

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

  readonly partnerId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('partnerId') ? params.get('partnerId') : undefined)
    )
  );

  readonly partner = resource({
    params: () => this.partnerId(),
    loader: async ({ params }) => {
      if (!params) {
        return undefined;
      }
      return firstValueFrom(this.partnerService.getById(params));
    }
  });

  readonly memberships = resource({
    params: () => this.partnerId(),
    loader: async ({ params }) => {
      if (!params) {
        return undefined;
      }
      return firstValueFrom(this.partnerService.findMembership(undefined, params));
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

  activitiesText(): string {
    return this.partner.value()?.activities
      .map(id => this.activities().find(a => a.id === id)?.activity)
      .join(', ') ?? '';
  }

  protected readonly Role = Role;
  protected readonly membershipLabel = membershipLabel;
}
