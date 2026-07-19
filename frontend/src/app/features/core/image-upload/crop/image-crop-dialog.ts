import {Component, inject} from '@angular/core';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-image-crop',
  imports: [
    ImageCropperComponent,
    MatButtonModule
  ],
  templateUrl: './image-crop-dialog.html',
  styleUrls: ['./image-crop-dialog.scss']
})
export class ImageCropDialog {

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ImageCropDialog>);
  croppedBlob?: Blob;

  constructor() {
    const dt = new DataTransfer();
    dt.items.add(this.data.file);
    const input = document.createElement('input');
    input.type = 'file';
    input.files = dt.files;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedBlob = event.blob ?? undefined;
  }

  save() {
    if (!this.croppedBlob) {
      return;
    }

    const file = new File(
      [this.croppedBlob],
      this.data.file.name,
      {
        type: this.croppedBlob.type
      }
    );

    this.dialogRef.close(file);
  }

}
