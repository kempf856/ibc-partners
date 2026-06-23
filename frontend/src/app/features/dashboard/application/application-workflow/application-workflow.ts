import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ApplicationService} from '../application-service';
import {DatePipe} from '@angular/common';
import {ApplicationDto} from '../application-dto';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {ApplicationState, applicationStateClass, applicationStateLabel} from '../../../../shared/application-state';
import {TextFieldModule} from '@angular/cdk/text-field';
import {UserService} from '../../user/user-service';
import {UserDto} from '../../user/user-dto';
import {PartnerService} from '../../partner/partner-service';
import {PartnerDto} from '../../partner/partner-dto';
import {PartnerMembershipDto} from '../../partner/partner-membership-dto';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {NotificationService} from '../../../../core/notification/notification';
import {membershipLabel, PartnerMembershipRole} from '../../../../shared/partner-membership-role';

@Component({
  selector: 'app-application-workflow',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule, ReactiveFormsModule, DatePipe, MatChip, MatChipSet, TextFieldModule, RouterLink, MatButtonToggleGroup, MatButtonToggle
  ],
  templateUrl: './application-workflow.html',
  styleUrl: './application-workflow.scss',
})
export class ApplicationWorkflow implements OnInit {

  protected readonly applicationStateLabel = applicationStateLabel;
  protected readonly applicationStateClass = applicationStateClass;
  protected readonly membershipLabel = membershipLabel;
  protected readonly ApplicationState = ApplicationState;
  protected readonly PartnerMembershipRole = PartnerMembershipRole;

  applicationService = inject(ApplicationService);
  userService = inject(UserService);
  partnerService = inject(PartnerService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  applicationDto = signal<ApplicationDto | null>(null);
  existingUser = signal<UserDto | null>(null);
  existingPartner = signal<PartnerDto | null>(null);
  membership = signal<PartnerMembershipDto | null>(null);

  form = new FormGroup({
    email: new FormControl(''),
    fullName: new FormControl(''),
    phone: new FormControl(''),
    companyName: new FormControl(''),
    taxNumber: new FormControl(''),
    source: new FormControl(''),
    comment: new FormControl('')
  });

  membershipRole = new FormControl<PartnerMembershipRole | null>(null, Validators.required);

  constructor() {
    effect(() => {
      const user = this.existingUser();
      const partner = this.existingPartner();

      if (!user || !partner) {
        return;
      }
      this.loadMembership();
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.applicationService.getApplication(id).subscribe(applicationDto => {
        this.form.patchValue(applicationDto);
        this.applicationDto.set(applicationDto);
        this.loadExistingUser(applicationDto.email);
        this.loadExistingPartner(applicationDto.taxNumber);
      });
    }
  }

  loadExistingUser(email: string) {
    this.userService.findByEmail(email, true).subscribe(userDto => {
      this.existingUser.set(userDto);
    })
  }

  loadExistingPartner(taxNumber: string) {
    this.partnerService.findByTaxNumber(taxNumber, true).subscribe(partnerDto => {
      this.existingPartner.set(partnerDto);
    })
  }

  loadMembership() {
    this.partnerService.findMembership(this.existingUser()?.id, this.existingPartner()?.id).subscribe(memberships => {
      if (memberships.length > 0) {
        this.membership.set(memberships[0]);
      }
    });
  }

  process() {
    if (this.applicationDto()?.id) {
      this.applicationService.process('' + this.applicationDto()?.id).subscribe(applicationDto => {
        this.form.patchValue(applicationDto);
        this.applicationDto.set(applicationDto);
      })
    }
  }

  accept() {
    if (this.applicationDto()?.id) {
      this.applicationService.accept('' + this.applicationDto()?.id).subscribe(applicationDto => {
        this.form.patchValue(applicationDto);
        this.applicationDto.set(applicationDto);
      })
    }
  }

  deny() {
    if (this.applicationDto()?.id) {
      this.applicationService.deny('' + this.applicationDto()?.id).subscribe(applicationDto => {
        this.form.patchValue(applicationDto);
        this.applicationDto.set(applicationDto);
      })
    }
  }

  comment() {
    if (this.applicationDto()?.id) {
      const comment = this.form.controls.comment.value ?? '';
      this.applicationService.comment('' + this.applicationDto()?.id, comment).subscribe(applicationDto => {
        this.form.patchValue(applicationDto);
        this.applicationDto.set(applicationDto);
      })
    }
  }

  cancel() {
    this.router.navigate(['/applications']);
  }

  protected saveMembershipRole() {
    this.partnerService.saveMembership({ userId: this.existingUser()!.id, partnerId: this.existingPartner()!.id, role: this.membershipRole.value } as PartnerMembershipDto).subscribe(() => {
      this.notificationService.success('Partner kapcsolat mentése sikeres');
      this.loadMembership();
    })
  }
}
