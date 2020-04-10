import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { SharedModule } from '../shared/shared.module';

const companyRoutes: Routes = [
  {
    path: '',
    // data: { noReuse: true },
    children: [
      {
        path:'',
        component: ContactComponent
      },
      {
        path: 'contact-list',
        component: ContactListComponent
      },
    ]
  }
];


@NgModule({
  declarations: [ContactComponent,ContactListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(companyRoutes)
  ]
})
export class ContactModule { }
