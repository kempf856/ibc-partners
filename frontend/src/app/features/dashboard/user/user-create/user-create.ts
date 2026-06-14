import {Component, effect, inject} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {ALL_ROLES, roleLabel} from '../../../../shared/role-labels';
import {UserService} from '../user-service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../../core/notification/notification';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ApplicationService} from '../../application/application-service';

@Component({
  selector: 'app-user-create',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatOption, MatSelect, MatButtonModule, ReactiveFormsModule
  ],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreate {
  protected readonly ALL_ROLES = ALL_ROLES;
  protected readonly roleLabel = roleLabel;

  userService = inject(UserService);
  applicationService = inject(ApplicationService)
  notification = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    fullName: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    roles: new FormControl([], { nonNullable: true })
  });
  readonly email = this.form.controls.email;

  readonly applicationId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('applicationId')),
      filter((id): id is string => !!id)
    )
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
  }

  protected save() {
    this.userService.createUser(this.form.getRawValue()).subscribe(() => {
        this.notification.success('Sikeres mentés');
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
}
