import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const userRoutes: Routes = [
  {
    path: 'edit-profile',
    component: EditUserProfileComponent
  }
];

@NgModule({
  declarations: [EditUserProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(userRoutes)
  ]
})
export class UserModule { }
