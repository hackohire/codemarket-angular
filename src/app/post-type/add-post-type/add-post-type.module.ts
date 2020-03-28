import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPostTypeComponent } from './add-post-type.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AddPostTypeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: AddPostTypeComponent
    }])
  ]
})

export class AddPostTypeModule { }
