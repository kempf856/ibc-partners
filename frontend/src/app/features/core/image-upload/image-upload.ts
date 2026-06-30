import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef, inject, input,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {FileUploadResponse} from './file-upload-response';
import {firstValueFrom} from 'rxjs';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUpload),
      multi: true
    }
  ]
})
export class ImageUpload implements ControlValueAccessor {

  http = inject(HttpClient);

  readonly fileId = signal<string | null>(null);

  readonly previewUrl = computed(() =>
    this.fileId()
      ? `${this.fileId()}`
      : null
  );

  readonly previewWidth = input(200);
  readonly previewHeight = input(150);

  readonly selectedFileName = signal<string | null>(null);

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.fileId.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  async upload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    this.selectedFileName.set(file.name);

    try {
      const url = await this.uploadFile(file);

      this.fileId.set(url);
      this.onChange(url);
      this.onTouched();
    } finally {
      input.value = '';
    }
  }

  remove() {
    this.fileId.set(null);
    this.selectedFileName.set(null);
    this.onChange(null);
    this.onTouched();
  }

  private async uploadFile(file: File): Promise<string> {
    const response = await firstValueFrom(
      this.uploadApi(file)
    );

    return response.url;
  }

  private uploadApi(file: File) {
    const formData = new FormData();
    formData.append('upload', file);

    return this.http.post<FileUploadResponse>('/api/files', formData);
  }
}
