import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const companyRoutes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
    data: { noReuse: true },
    children: [
      {
        path: 'company-list',
        component: CompaniesListComponent
      },
      {
        path: 'add-company',
        component: AddCompanyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit-company/:companyId',
        component: AddCompanyComponent
      },
    ]
  }
];

@NgModule({
  declarations: [CompaniesComponent, AddCompanyComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(companyRoutes)
  ]
})
export class CompaniesModule { }
