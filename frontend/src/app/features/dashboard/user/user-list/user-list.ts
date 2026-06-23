import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../user-service';
import {UserDto} from '../user-dto';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {ALL_ROLES, roleLabel} from '../../../../shared/role';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-user-list',
  imports: [
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
    MatSelect,
    MatOption,
    MatTable,
    MatSortModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatChip,
    MatChipSet,
    MatButtonModule,
    RouterLink,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {

  protected readonly ALL_ROLES = ALL_ROLES;
  protected readonly roleLabel = roleLabel;

  dataSource = new MatTableDataSource<UserDto>([]);
  userService = inject(UserService);

  totalElements = 0;

  pageSize = 10;
  pageIndex = 0;

  sort = 'email,asc';

  emailFilter = '';
  fullNameFilter = '';
  roleFilter = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers({
      page: this.pageIndex,
      size: this.pageSize,
      sort: this.sort,
      email: this.emailFilter,
      fullName: this.fullNameFilter,
      role: this.roleFilter
    }).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalElements = res.totalElements;
    });
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onSort(event: Sort) {
    this.sort = `${event.active},${event.direction}`;
    this.loadUsers();
  }
}
