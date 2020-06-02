import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CompanyDetailsComponent } from './company-details/company-details/company-details.component';

const companyRoutes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
    // data: { noReuse: true },
    children: [
      {
        path: 'company-list',
        component: CompaniesListComponent
      },
      {
        path: 'add-company',
        component: AddCompanyComponent,
        canLoad: [AuthGuard]
      },
      {
        path: ':slug',
        component: CompanyDetailsComponent,
        // data: { noReuse: true }
      },
      {
        path: 'edit-company/:companyId',
        component: AddCompanyComponent,
        canLoad: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  declarations: [CompaniesComponent, CompanyDetailsComponent, AddCompanyComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(companyRoutes)
  ],
})
export class CompaniesModule { }
