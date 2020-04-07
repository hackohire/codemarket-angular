import { Component, OnInit } from '@angular/core';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MakeMoney} from './../shared/models/makemony.model';

@Component({
  selector: 'app-makemoneyonline',
  templateUrl: './makemoneyonline.component.html',
  styleUrls: ['./makemoneyonline.component.scss']
})
export class MakemoneyonlineComponent implements OnInit {

  constructor() {
    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: `Make Money Online`,
    };

    this.makeMoneyFormInitialization(null);
   }

  ngOnInit() {
  }

  selectedRadio = 'Yes'; //default value

  radioChange(e){
    console.log(this.selectedRadio)
    this.selectedRadio = e.value;
  }

  breadcumb: BreadCumb;
  makeMoneyOnlineForm: FormGroup;
  
  makeMoneyFormInitialization(i: MakeMoney) {
    this.makeMoneyOnlineForm = new FormGroup({
      firstName: new FormControl(i && i.firstName ? i.firstName : '', Validators.required),
      lastName: new FormControl(i && i.lastName ? i.lastName : '', Validators.required),
      email: new FormControl(i && i.email ? i.email : '', Validators.required),
      phone: new FormControl(i && i.phone ? i.phone : '', Validators.required),
      haveBusiness: new FormControl(i && i.haveBusiness ? i.haveBusiness : '', Validators.required),
      describeBusiness: new FormControl(i && i.describeBusiness ? i.describeBusiness : '', Validators.required),
      WebsiteLink: new FormControl(i && i.WebsiteLink ? i.WebsiteLink: '', Validators.required),
      businessAddress: new FormControl(i && i.businessAddress ? i.businessAddress : '', Validators.required)
    });
  }

  submit(){
  }
}
