import { Component, OnInit } from '@angular/core';
import {ContactService} from './contact.service';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import Swal from 'sweetalert2';
import { catchError, } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  formFieldObject: any;
  contactForm: FormGroup;

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private fb: FormBuilder
    
  ) { }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: '',
      email: '',
      subject: '',
      description: ''
    })
  }


  submitContact(){
    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.contactService.addContact(this.contactForm.value).pipe(
      catchError((e) => {
        Swal.fire('Name already exists!', '', 'error');
        return of(false);
      })
    ).subscribe((d: any) => {
      if (d) {
        Swal.fire(`${d.name} has been Created Successfully`, '', 'success').then(() => {
          this.contactService.redirectToCompanyDetails(d._id);
        });
      }
    });
  }

  getContact(name, email, subject, description) {
    const formFieldObject = {
      name: name,
      email: email,
      subject: subject,
      description: description
    };

    this.contactService.getContact(formFieldObject).subscribe((contact) => {
      if (contact) {
        this.formFieldObject = contact;
      }
    })

  }

}
