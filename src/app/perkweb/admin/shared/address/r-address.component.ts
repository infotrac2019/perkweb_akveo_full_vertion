import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "ngx-r-address",
  templateUrl: "./r-address.component.html",
  styleUrls: ["./r-address.component.scss"],
})
export class RAddressComponent implements OnInit {
  @Input() formGroupName: String;

  constructor() {}

  ngOnInit() {}
}
