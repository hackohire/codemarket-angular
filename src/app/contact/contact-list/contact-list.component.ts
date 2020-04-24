import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { AuthService } from '../../core/services/auth.service';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { ContactService } from '../contact.service';

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
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService,
    private store: Store<AppState>,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.breadcumb = {
      title: 'Subsriber List',
    };
    
    this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'address','showDate'];
    this.contactListSubscription = this.contactService.fetchcontact().subscribe((contactlist) => {
      this.dataSource.data = contactlist;
      console.log(contactlist)
    });
    
  }

}
