import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  all: boolean;
  authorId: string;
  breadcumb: BreadCumb;
  type: string;

  userSubsription: Subscription;
  contactListSubscription: Subscription;

  constructor(
    public contactService: ContactService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.breadcumb = {
      title: 'List of Contacts',
    };

    this.displayedColumns = ['number', 'name', 'email', 'subject', 'description'];
    this.contactListSubscription = this.contactService.fetchContacts().subscribe((contactList) => {
      this.dataSource.data = contactList;
      console.log(contactList)
    });

  }
}
