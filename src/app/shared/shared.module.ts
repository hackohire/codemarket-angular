import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BreadcumbComponent } from './components/breadcumb/breadcumb.component';

@NgModule({
  declarations: [BreadcumbComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    QuillModule.forRoot(),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  exports: [
    BreadcumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    QuillModule
  ]
})
export class SharedModule { }
