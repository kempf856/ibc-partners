import {Component, inject, OnInit, signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ApplicationService} from '../application-service';
import {DatePipe} from '@angular/common';
import {ApplicationDto} from '../application-dto';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {ApplicationState, applicationStateClass, applicationStateLabel} from '../../../../shared/application-state';
import { TextFieldModule } from '@angular/cdk/text-field';
import {UserService} from '../../user/user-service';
import {UserDto} from '../../user/user-dto';

@Component({
  selector: 'app-application-workflow',
  imports: [
    MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule, ReactiveFormsModule, DatePipe, MatChip, MatChipSet, TextFieldModule, RouterLink
  ],
  templateUrl: './application-workflow.html',
  styleUrl: './application-workflow.scss',
})
export class ApplicationWorkflow implements OnInit {

  protected readonly applicationStateLabel = applicationStateLabel;
  protected readonly applicationStateClass = applicationStateClass;
  protected readonly ApplicationState = ApplicationState;

  applicationService = inject(ApplicationService)
  userService = inject(UserService)
  router = inject(Router)
  route = inject(ActivatedRoute);

  applicationDto = signal<ApplicationDto | null>(null);
  existingUser = signal<UserDto | null>(null);
  existingPartner?: UserDto;

  form = new FormGroup({
    email: new FormControl(''),
    fullName: new FormControl(''),
    phone: new FormControl(''),
    companyName: new FormControl(''),
    taxNumber: new FormControl(''),
    source: new FormControl(''),
    comment: new FormControl('')
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.applicationService.getApplication(id).subscribe(applicationDto => {
        this.form.patchValue(applicationDto);
        this.applicationDto.set(applicationDto);
        this.loadExistingUser(applicationDto.email);
      });
    }
  }

  loadExistingUser(email: string) {
    this.userService.findByEmail(email).subscribe(userDto => {
      this.existingUser.set(userDto);
    })
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
}
