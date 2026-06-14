import {SettingKey} from '../../../shared/setting-key';

export interface SettingDto {
  key: SettingKey;
  name: string;
  value: string;
}
