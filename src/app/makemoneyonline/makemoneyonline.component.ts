import { Component, OnInit } from '@angular/core';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import {MakeMoney} from './../shared/models/makemony.model';
import {MakemoneyonlineService} from './makemoneyonline.service';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-makemoneyonline',
  templateUrl: './makemoneyonline.component.html',
  styleUrls: ['./makemoneyonline.component.scss']
})
export class MakemoneyonlineComponent implements OnInit {

  constructor(private makemoneyonlineService: MakemoneyonlineService,   private fb: FormBuilder) {

    
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

    this.makemoneyonlineService.addMakeMoney(this.makeMoneyOnlineForm.value).pipe(
      catchError((e) => {
        Swal.fire('Name already exists!', '', 'error');
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.firstName} has been Added Successfully`, '', 'success').then(() => {
          this.makemoneyonlineService.redirectToCompanyDetails(d._id, d.slug);
        });
      }
    });

  }
}
