import { Component, OnInit } from "@angular/core";
import { Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { NbRadioComponent } from "@nebular/theme";

@Component({
  selector: "ngx-smart-table-radio",
  template: `<nb-radio (click)="onClick()"></nb-radio> `,
})
export class SmartTableRadioComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() selectRow: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.selectRow.emit(this.rowData);
  }
}
