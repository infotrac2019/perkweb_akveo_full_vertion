import { Component, OnInit, Input } from '@angular/core';
import { Address } from '../../model/address.model';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'ngx-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class AddressComponent implements OnInit {

  @Input() address:Address;

  constructor() { }

  ngOnInit(): void {
  }

}
