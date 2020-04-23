import { Component, OnInit } from '@angular/core';
import { BreadCumb } from './../shared/models/bredcumb.model';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import {ContactService} from './contact.service';
import {Contact} from '../shared/models/contact.model';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  breadcumb: BreadCumb;
  contactForm: FormGroup;

  constructor(private contactService: ContactService,   private fb: FormBuilder) {

    
    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: `Pick Show Date`,
    };

    this.contactFormInitialization(null);
   }

   contactFormInitialization(i: Contact) {
    this.contactForm = new FormGroup({
      firstName: new FormControl(i && i.firstName ? i.firstName : '', Validators.required),
      lastName: new FormControl(i && i.lastName ? i.lastName : '', Validators.required),
      email: new FormControl(i && i.email ? i.email : '', Validators.required),
      phone: new FormControl(i && i.phone ? i.phone : '', Validators.required),
      address: new FormControl(i && i.address ? i.address : '', Validators.required),
      showDate: new FormControl(i && i.showDate ? i.showDate : '', Validators.required),
    });
  }

  ngOnInit() {
  }

  submit(){

    this.contactService.addcontact(this.contactForm.value).pipe(
      catchError((e) => {
        console.log("Error : "+e )
        Swal.fire('Name already exists!', '', 'error');
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.firstName} has been Added Successfully`, '', 'success').then(() => {
          this.contactService.redirectToCompanyDetails(d._id);
        });
      }
    });

  }

}
