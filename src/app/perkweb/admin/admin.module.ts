import { AdminRoutingModule } from "./admin-routing.module";
import { VendorComponent } from "./vendor/vendor/vendor.component";
import { AddVendorComponent } from "./vendor/add-vendor/add-vendor.component";
import { CompanyComponent } from "./company/company.component";
import { AdminComponent } from "./admin.component";
import { AddUserComponent } from "./user/add-user/add-user.component";
import { UserListComponent } from "./user/user-list/user-list.component";
import { NgModule } from "@angular/core";
import { PerkwebLibModule } from "../../lib/perkweb-lib.module";
import { NbMenuModule, NbDatepickerModule } from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";
import { AddCompanyComponent } from "./add-company/add-company.component";
import { AddressComponent } from "./address/address.component";
import { RAddressComponent } from "./shared/address/r-address.component";

import { ShowcaseDialogComponent } from "./themeComponent/showcase-dialog/showcase-dialog.component";
import { OfferComponent } from "./offer/offer/offer.component";
import { AddOfferComponent } from "./offer/add-offer/add-offer.component";
import { EntityPopupComponent } from "./themeComponent/entity-popup/entity-popup.component";
import { ImageUploadComponent } from "./themeComponent/image-upload/image-upload.component";
@NgModule({
  imports: [
    AdminRoutingModule,
    PerkwebLibModule,
    ThemeModule,
    NbMenuModule,
    NbDatepickerModule.forRoot(),
  ],
  declarations: [
    CompanyComponent,
    AdminComponent,
    AddCompanyComponent,
    VendorComponent,
    AddVendorComponent,
    AddressComponent,
    ShowcaseDialogComponent,
    UserListComponent,
    AddUserComponent,
    OfferComponent,
    AddOfferComponent,
    EntityPopupComponent,
    RAddressComponent,
    ImageUploadComponent,
  ],
})
export class AdminModule {}
