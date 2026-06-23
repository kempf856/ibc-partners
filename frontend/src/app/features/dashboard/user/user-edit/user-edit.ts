import {Component, computed, effect, inject, signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {ALL_ROLES, Role, roleLabel} from '../../../../shared/role';
import {UserService} from '../user-service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../../core/notification/notification';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApplicationService} from '../../application/application-service';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {UserDto} from '../user-dto';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {membershipLabel, PartnerMembershipRole} from '../../../../shared/partner-membership-role';
import {PartnerService} from '../../partner/partner-service';
import {PartnerMembershipDto} from '../../partner/partner-membership-dto';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {PartnerDto} from '../../partner/partner-dto';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {ConfirmDialogComponent} from '../../../../core/dialog/confirm-dialog-component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatOption, MatSelect, MatButtonModule, ReactiveFormsModule, MatChip, MatChipSet, MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatIcon, MatRow, MatRowDef, MatTable, MatTooltip, MatHeaderCellDef, MatAutocomplete, MatAutocompleteTrigger, MatButtonToggle, MatButtonToggleGroup
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit {
  protected readonly ALL_ROLES = ALL_ROLES;
  protected readonly roleLabel = roleLabel;
  protected readonly membershipLabel = membershipLabel;
  protected readonly PartnerMembershipRole = PartnerMembershipRole;

  userService = inject(UserService);
  applicationService = inject(ApplicationService);
  partnerService = inject(PartnerService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  form = new FormGroup({
    id: new FormControl<number>(0, { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    fullName: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    roles: new FormControl<Role[]>([], { nonNullable: true })
  });
  readonly email = this.form.controls.email;

  readonly partnerSearch = new FormControl<string>('');
  readonly membershipRole = new FormControl<PartnerMembershipRole | null>(null, Validators.required);

  filteredPartners = computed(() => {
    const search = this.partnerSearch.value?.toLowerCase() ?? '';
    return this.partners().filter(p => p.name.toLowerCase().includes(search));
  });

  displayMode = this.route.snapshot.data['mode'] as DisplayMode;

  readonly applicationId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('applicationId')),
      filter((id): id is string => !!id)
    )
  );

  readonly userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('userId')),
      filter((id): id is string => !!id)
    )
  );

  readonly userDto = signal<UserDto | null>(null);
  readonly memberships = signal<PartnerMembershipDto[]>([]);

  partnerId : number | null = null;
  readonly partners = toSignal(
    this.partnerService.getAll(),
    { initialValue: [] }
  );

  constructor() {
    effect(() => {
      const id = this.applicationId();
      if (!id) return;

      this.applicationService.getApplication(id)
        .subscribe(app => {
          this.form.patchValue({
            email: app.email,
            fullName: app.fullName,
            phone: app.phone
          });
        });
    });

    effect(() => {
      const userId = this.userId();
      if (!userId) return;

      this.userService.findById(userId).subscribe((userDto) => {
        this.form.patchValue(userDto);
        this.userDto.set(userDto);
      });
      this.loadMembership(userId);
    });
  }

  onSelectedPartner(partner: PartnerDto) {
    this.partnerId = partner.id;
  }

  loadMembership(userId: string) {
    this.partnerService.findMembership(userId).subscribe((memberships) => {
      this.memberships.set(memberships);
    })
  }

  protected save() {
    this.userService.saveUser(this.form.getRawValue()).subscribe(() => {
        this.notificationService.success('Sikeres mentés');
        this.cancel();
      });
  }

  cancel() {
    if (this.applicationId()) {
      this.router.navigate(['/applications', this.applicationId()]);
    } else {
      this.router.navigate(['/users']);
    }
  }

  readonly(onlyCreate?: boolean) {
    return this.displayMode === 'view' || (onlyCreate && this.displayMode === 'edit');
  }

  appearance(onlyCreate?: boolean) {
    return this.readonly(onlyCreate) ? 'fill' : 'outline';
  }

  displayPartner = (partner?: PartnerDto): string => {
    return partner ? partner.name : '';
  };

  saveMembershipRole() {
    this.partnerService.saveMembership({ userId: Number(this.userId()), partnerId: this.partnerId, role: this.membershipRole.value }  as PartnerMembershipDto).subscribe(() => {
      this.membershipRole.setValue(null);
      this.partnerSearch.setValue(null);
      this.partnerSearch.markAsPristine()
      this.partnerSearch.markAsUntouched();
      this.partnerId = null;
      this.notificationService.success('Partner kapcsolat mentése sikeres');
      const userId = this.userId();
      if (userId) this.loadMembership(userId);
    })
  }

  deleteMembershipRole(membership: PartnerMembershipDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Törlés',
        message: `Biztos törölni szeretnéd ezt a partner kapcsolatot: ${membership.partnerName}?`

      },
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && membership.id) {
        this.partnerService.deleteMembership(membership.id).subscribe(() => {
          this.notificationService.success('Partner kapcsolat törlése sikeres');
          const userId = this.userId();
          if (userId) this.loadMembership(userId);
        });
      }
    });
  }

}
