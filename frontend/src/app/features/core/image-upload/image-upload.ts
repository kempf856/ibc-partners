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
import {MatDialog} from '@angular/material/dialog';
import {ImageCropDialog} from './crop/image-crop-dialog';

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
  dialog = inject(MatDialog);

  readonly fileId = signal<string | null>(null);

  readonly previewUrl = computed(() =>
    this.fileId()
      ? `${this.fileId()}`
      : null
  );

  readonly previewWidth = input(200);
  readonly previewHeight = input(150);

  readonly crop = input(false);
  readonly cropAspectRatio = input(1);
  readonly cropResizeWidth = input<number | null>(null);
  readonly cropResizeHeight = input<number | null>(null);

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
    const originalFile = input.files[0];

    let file = originalFile;
    if (this.crop()) {
      const dialogRef = this.dialog.open(ImageCropDialog, {
        width: '800px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        disableClose: true,
        data: {
          file: originalFile,
          aspectRatio: this.cropAspectRatio(),
          resizeWidth: this.cropResizeWidth(),
          resizeHeight: this.cropResizeHeight()
        }
      });

      const cropped = await firstValueFrom(dialogRef.afterClosed());
      if (!cropped) {
        input.value = '';
        return;
      }
      file = cropped;
    }

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
