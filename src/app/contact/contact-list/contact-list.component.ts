import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Company } from '../../shared/models/company.model';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { startCase } from 'lodash';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { selectLoggedInUser } from '../../core/store/selectors/user.selector';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedCompany: Company | null;
  all: boolean;
  authorId: string;
  breadcumb: BreadCumb;
  type: string;

  userSubsription: Subscription;
  companiesListSubscription: Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public contactService: ContactService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService,
    private store: Store<AppState>,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.breadcumb = {
      title: 'List of Contacts',
    };

    this.displayedColumns = ['number', 'name', 'email', 'subject', 'description'];
    this.companiesListSubscription = this.contactService.fetchContacs().subscribe((contacts) => {
      this.dataSource.data = contacts;
    });
    this.dataSource.sort = this.sort;

  }

}
