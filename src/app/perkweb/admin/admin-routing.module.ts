import { VendorComponent } from "./vendor/vendor/vendor.component";
import { AddVendorComponent } from "./vendor/add-vendor/add-vendor.component";
import { CompanyComponent } from "./company/company.component";

import { AddUserComponent } from "./user/add-user/add-user.component";
import { UserListComponent } from "./user/user-list/user-list.component";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { AdminComponent } from "./admin.component";
import { AddCompanyComponent } from "./add-company/add-company.component";
import { OfferComponent } from "./offer/offer/offer.component";
import { AddOfferComponent } from "./offer/add-offer/add-offer.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "company",
        component: CompanyComponent,
      },
      {
        path: "company/add",
        component: AddCompanyComponent,
      },
      {
        path: "company/edit/:id",
        component: AddCompanyComponent,
      },
      {
        path: "vendor",
        component: VendorComponent,
      },
      {
        path: "vendor/add",
        component: AddVendorComponent,
      },
      {
        path: "vendor/edit/:id",
        component: AddVendorComponent,
      },
      {
        path: "user",
        component: UserListComponent,
      },
      {
        path: "user/add",
        component: AddUserComponent,
      },
      {
        path: "user/edit/:id",
        component: AddUserComponent,
      },
      {
        path: "offer",
        component: OfferComponent,
      },
      {
        path: "offer/add",
        component: AddOfferComponent,
      },
      {
        path: "offer/edit/:id",
        component: AddOfferComponent,
      },
      /*,
      {
        path: "**",
        component: NotFoundComponent,
      },*/
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
