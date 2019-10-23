import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Company, CompanyTypes } from '../../shared/models/company.model';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import _ from 'lodash';
import { AppState } from '../../core/store/state/app.state';
import { CompanyService } from '../company.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CompaniesListComponent implements OnInit {

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedCompany: Company | null;
  all: boolean;
  authorId: string;
  breadcumb: BreadCumb;


  userSubsription: Subscription;
  companiesListSubscription: Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService
  ) { }

  ngOnInit() {

    // this.all = JSON.parse(this.activatedRoute.snapshot.queryParams.all);

    const type: string = this.activatedRoute.snapshot.queryParams.type;

    this.breadcumb = {
      title: 'List of ' + _.startCase(type),
      path: [
        {
          name: 'Dashboard',
          pathString: '/',
        },
        {
          name: type
        }
      ]
    };

    this.displayedColumns = ['number', 'name', 'cities', 'createdAt', 'action'];
    this.companiesListSubscription = this.companyService.getCompaniesByType(type).subscribe((companies) => {
      this.dataSource.data = companies;
    })
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.companiesListSubscription) {
      this.companiesListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.companiesListSubscription.unsubscribe();
    }
  }


  editCompany(company): void {
    // this.store.dispatch(SetSelectedCompany({company}));
    // this.router.navigate(['/add-company'], );
  }

  deleteCompany(companyId: string) {
    this.sweetAlertService.confirmDelete(() => {
      // this.store.dispatch(DeleteCompany({ companyId }));
      this.companyService.deleteCompany(companyId).subscribe((deleted) => {
        if (deleted) {
          this.dataSource.data = this.dataSource.data.filter((d: any) => d._id !== companyId);
          // this.length = this.length - 1;
          this.dataSource._updateChangeSubscription();
        }
      })
    })
  }

}