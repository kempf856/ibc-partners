import {Component, inject, OnInit} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
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
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {SettingDto} from './setting-dto';
import {SettingService} from './setting-service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NotificationService} from '../../../core/notification/notification';
import {SettingKey} from '../../../shared/setting-key';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-setting-list',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
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
    MatButtonModule,
    MatIcon,
    MatTooltip,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './setting-list.html',
  styleUrl: './setting-list.scss',
})
export class SettingList implements OnInit {

  dataSource = new MatTableDataSource<SettingDto>([]);
  settingService = inject(SettingService);
  notificationService = inject(NotificationService);

  totalElements = 0;

  pageSize = 20;
  pageIndex = 0;

  sort = 'name,asc';

  editMode = false;
  key = new FormControl<SettingKey | null>(null, { nonNullable: true });
  name = new FormControl('', { nonNullable: true });
  value = new FormControl('', { nonNullable: true });

  settingKeys = Object.values(SettingKey);

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.settingService.search({
      page: this.pageIndex,
      size: this.pageSize,
      sort: this.sort
    }).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalElements = res.totalElements;
    });
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSettings();
  }

  onSort(event: Sort) {
    this.sort = `${event.active},${event.direction}`;
    this.loadSettings();
  }

  edit(setting: SettingDto): void {
    this.editMode = true;
    this.key.setValue(setting.key);
    this.name.setValue(setting.name);
    this.value.setValue(setting.value);
  }

  save(): void {
    this.settingService.save(this.editMode, { key: this.key.value!, name: this.name.value, value: this.value.value }).subscribe(() => {
      this.notificationService.success('Beállítás mentése sikeres');
      this.cancel();
      this.loadSettings();
    });
  }

  cancel() {
    this.editMode = false;
    this.key.setValue(null);
    this.key.markAsPristine()
    this.key.markAsUntouched();
    this.name.setValue('');
    this.name.markAsPristine();
    this.name.markAsUntouched();
    this.value.setValue('');
    this.value.markAsPristine();
    this.value.markAsUntouched();
  }
}
