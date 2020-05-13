import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: "ngx-entity-popup",
  templateUrl: "./entity-popup.component.html",
  styleUrls: ["./entity-popup.component.scss"],
})
export class EntityPopupComponent implements OnInit {
  @Input() data: any[];
  @Input() title: string;
  @Input() preSelectCriteria: any[];
  @Input() settings: any;

  source: LocalDataSource = new LocalDataSource();
  selectedRows: any[];

  constructor(protected ref: NbDialogRef<EntityPopupComponent>) {}
  ngOnInit(): void {
    this.data = this.data.filter(
      (obj) => !this.preSelectCriteria.includes(obj)
    );
    this.source.load(this.data);
    this.preSelectCriteria.forEach((row) => {
      this.source.remove(row);
    });
  }

  dismiss() {
    this.ref.close();
  }
  onSubmit() {
    console.log(this.selectedRows);
    this.ref.close(this.selectedRows);
  }

  onUserRowSelect($event) {
    this.selectedRows = $event.selected;
  }
}
