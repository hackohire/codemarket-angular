import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {GetQuoteComponent} from './get-quote.component';
import {QuoteListComponent} from './quotelist/quotelist.component';
import { SharedModule } from '../shared/shared.module';

const contactRoutes: Routes = [
  {
    path: '',
   
    // data: { noReuse: true },
    children: [
      {
        path:'',
        component: GetQuoteComponent
      },
      {
        path: 'quote-list',
        component: QuoteListComponent
      },
    ]
  }
];

@NgModule({
  declarations: [GetQuoteComponent,QuoteListComponent ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(contactRoutes)
  ],
  exports:[
    GetQuoteComponent
  ]
})
export class GetQuoteModule { }
