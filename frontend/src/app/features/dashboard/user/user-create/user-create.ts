import {Component, inject} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatError, MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {roleLabel} from '../../../../shared/role-labels';
import {UserService} from '../user-service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../core/notification/notification';

@Component({
  selector: 'app-user-create',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatError, FormsModule, MatOption, MatSelect, MatButtonModule
  ],
  templateUrl: './user-create.html',
  styleUrl: './user-create.scss',
})
export class UserCreate {
  protected readonly roleLabel = roleLabel;

  userService = inject(UserService);
  notification = inject(NotificationService);

  email: string = '';
  fullName: string = '';
  roles: string[] = [];

  constructor(private router: Router) {}

  protected save() {
    this.userService.createUser({ email: this.email, fullName: this.fullName, roles: this.roles }).subscribe(() => {
        this.notification.success('Sikeres mentés');
        this.cancel();
      });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
