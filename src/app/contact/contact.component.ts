import { Component, OnInit } from '@angular/core';
import {ContactService} from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  formFieldObject: any;

  constructor(
    private contactService: ContactService
  ) { }

  ngOnInit() {
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
