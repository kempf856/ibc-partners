import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActuatorInfo} from './actuator-info';
import {map} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  http = inject(HttpClient);
  datePipe = inject(DatePipe);

  version = toSignal(this.getVersion());

  getVersion() {
    return this.http
      .get<ActuatorInfo>('/api/actuator/info')
      .pipe(
        map(res => 'v' + res.build.version + ' | ' + this.datePipe.transform(res.build.time, 'yyyy.MM.dd HH:mm'))
      );
  }
}
