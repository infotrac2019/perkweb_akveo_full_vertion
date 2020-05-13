import { Component, OnInit } from '@angular/core';
import { Offer } from '../../../model/offer.model';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpRequestService } from '../../../services/http-request.service';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { APIEndPoints } from '../../../services/API-end-points';
import { ShowcaseDialogComponent } from '../../themeComponent/showcase-dialog/showcase-dialog.component';
import { ResponseDto } from '../../../model/response-dto';

@Component({
  selector: 'ngx-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  offerList: Offer[] = [];
  deleteConfirm: boolean = false;
  status: string = "basic";
  buttonStatus;

  constructor(
    private _httpService: HttpRequestService,
    private router: Router,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.resetBtnStatus();
    this.getAllOffers();
  }

  settings = {
    mode: "external",
    actions: {
      add: false,
      position: "right",
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: "Id",
        type: "string",
      },
      offerName: {
        title: "Offer Name",
        type: "string",
        width: "600px"
      },
      vendorName: {
        title: "Brand",
        valuePrepareFunction: (cell, row) => {
          if (row.vendor) {
            return row.vendor.vendorName;
          }
        }
      },
      offerType: {
        title: "Type",
        type: "string",
      },
      group: {
        title: "Group",
        valuePrepareFunction: (cell, row) => {
          if(row.group){
            return row.group.name;
          }
        }
      },
      displayStatus: {
        title: "Status",
        type: "string",
      },
      offerStartDate: {
        title: "Start Date",
        type: "Date",
      },
      offerEndDate: {
        title: "End Date",
        type: "Date",
      },
      creationDate: {
        title: "Created At",
        type: "Date",
      },
      updationDate: {
        title: "Updated At",
        type: "Date",
      },
    },
  };

  getAllOffers() {
    this._httpService
      .getData(APIEndPoints.fetchOfferListUrl, false)
      .subscribe((offerList: any) => {
        this.offerList = offerList.dataItems;
        this.source.load(this.offerList);
        console.log(offerList.dataItems);
      });

      this.resetBtnStatus();
      this.buttonStatus["ALL"] = "primary";
  }

  onEditConfirm(event) {
    console.log(event);
    this.router.navigate(["admin/offer/edit", event.data.id]);
  }
  onDeleteConfirm(event) {
    this.dialogService
      .open(ShowcaseDialogComponent, {
        context: {
          title: "DELETE",
          message: " Are you sure you want to delete?",
        },
      })
      .onClose.subscribe((ok) => {
        this.deleteConfirm = ok;
        if (this.deleteConfirm) {
          console.log("deleteConfirm");
          console.log(event);

          this._httpService
            .deleteData(APIEndPoints.deleteOfferUrl, event.data.id, true)
            .subscribe((data: ResponseDto<any>) => {
              this.source.remove(event.data);
            });
        }
      });

  }

  resetBtnStatus(){
    this.status = "basic";
    this.buttonStatus = {
      ALL: this.status,
      DRAFT: this.status,
      ACTIVE: this.status,
      DISABLED: this.status,
      UPCOMING: this.status,
      EXPIRING: this.status,
      EXPIRED: this.status,
    };
  }

  filterOfferListByStatus(btnStatus: string) {
      
    this.resetBtnStatus();
    this.buttonStatus[btnStatus] = "primary";
    const offersByStatus = this.offerList.filter(offer => {

      if (btnStatus == "ACTIVE") {
        return (offer.offerStatus == "ACTIVE" ||
          offer.offerStatus == "EXPIRING")
      } else {
        return offer.offerStatus == btnStatus;
      }
    })

    this.source.load(offersByStatus);
  }
}
