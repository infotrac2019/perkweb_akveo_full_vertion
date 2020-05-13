import { NotFoundComponent } from "./not-found/not-found.component";
import { NgModule } from "@angular/core";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbInputModule,
  NbAutocompleteModule,
  NbAccordionModule,
  NbDialogModule,
  NbAlertModule,
  NbCheckboxModule,
} from "@nebular/theme";
import { NgxEchartsModule } from "ngx-echarts";
import { Ng2SmartTableModule } from "ng2-smart-table";

import { ThemeModule } from "../@theme/theme.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CKEditorModule } from "ng2-ckeditor";
import { ImageCropperModule } from "ngx-image-cropper";
import { SmartTableRadioComponent } from "./smart-table-radio/smart-table-radio.component";

const libModules = [
  FormsModule,
  ThemeModule,
  NbCardModule,
  NbUserModule,
  NbButtonModule,
  NbTabsetModule,
  NbActionsModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NgxEchartsModule,
  Ng2SmartTableModule,
  NbInputModule,
  NbAutocompleteModule,
  NbAccordionModule,
  NbDialogModule,
  NbAlertModule,
  CKEditorModule,
  NbCheckboxModule,
  ReactiveFormsModule,
  ImageCropperModule,
];

@NgModule({
  imports: [...libModules],
  exports: [...libModules],
  declarations: [NotFoundComponent, SmartTableRadioComponent],
})
export class PerkwebLibModule {}
