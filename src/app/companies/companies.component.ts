import { Component, OnInit } from '@angular/core';
import { CompanyTypes } from '../shared/models/company.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  currentRoutes = [];
  navLinks = [];

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navLinks = [
      {
        path: 'company-list',
        label: 'Local Business List',
        type: CompanyTypes.LocalBusiness,
        queryParams: { type: CompanyTypes.LocalBusiness, all: false },
      },
      {
        path: 'add-company',
        label: 'Add Local Business',
        type: CompanyTypes.LocalBusiness,
        queryParams: { type: CompanyTypes.LocalBusiness },
      },

      {
        path: 'company-list',
        label: 'Non Profit List',
        type: CompanyTypes.NonProfit,
        queryParams: { type: CompanyTypes.NonProfit, all: false },
      },
      {
        path: 'add-company',
        label: 'Add Non Profit',
        type: CompanyTypes.NonProfit,
        queryParams: { type: CompanyTypes.NonProfit },
      },

      {
        path: 'company-list',
        label: 'Startup List',
        type: CompanyTypes.Startup,
        queryParams: { type: CompanyTypes.Startup, all: false },
      },
      {
        path: 'add-company',
        label: 'Add Startup',
        type: CompanyTypes.Startup,
        queryParams: { type: CompanyTypes.Startup },
      },
    ];

    /** Filtering Routes Based On Post Type */
    this.currentRoutes = this.navLinks.filter(n => n.type === this.activatedRoute.snapshot.queryParams.type);
  }

}
