import { Image } from "./../../../model/image.model";
import { Component, OnInit, Input, Output } from "@angular/core";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "ngx-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit {
  @Input() aspectRatio: any;
  @Input() title: string = "Image";
  @Input() settings: any;
  @Input() imgDisplayClass: string = "";
  constructor(protected ref: NbDialogRef<ImageUploadComponent>) {}

  ngOnInit() {}

  imageChangedEvent: any = "";
  image: Image = new Image();

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(event.target.files[0].type);
    if (event.target && event.target.files[0]) {
      this.image.imageType = event.target.files[0].type;
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.image.imageContent = event.base64;
  }
  imageLoaded(event) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  dismiss() {
    this.ref.close();
  }
  onSelect() {
    this.ref.close(this.image);
  }
}
