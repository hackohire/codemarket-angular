import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPostComponent } from './add-post.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormioModule } from 'angular-formio';


@NgModule({
  declarations: [AddPostComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormioModule,
    RouterModule.forChild([{
      path: '',
      component: AddPostComponent
    }])
  ]
})
export class AddPostModule { }
