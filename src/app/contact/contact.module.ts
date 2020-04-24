import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactComponent } from './contact.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import {MatNativeDateModule} from '@angular/material';

const contactRoutes: Routes = [
  {
    path: '',
   
    // data: { noReuse: true },
    children: [
      {
        path:'',
        component: ContactComponent
      },
      {
        path: 'subscriber-list',
        component: ContactListComponent
      },
    ]
  }
];


@NgModule({
  declarations: [ContactListComponent,ContactComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatNativeDateModule,
    RouterModule.forChild(contactRoutes)
  ]
})
export class ContactModule { }
