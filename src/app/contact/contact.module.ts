import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactComponent } from './contact.component';
import { RouterModule, Routes } from '@angular/router';

const contactRoutes: Routes = [
  {
    path: '',
    component: ContactComponent,
    // data: { noReuse: true },
    children: [
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
    RouterModule.forChild(contactRoutes)
  ]
})
export class ContactModule { }
