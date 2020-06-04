import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendEmailComponent } from './send-email.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
// import { MaterialFileInputModule } from 'ngx-material-file-input';

const emailRoutes: Routes = [
  {
    path: '',
    component: SendEmailComponent
  }
]

@NgModule({
  declarations: [SendEmailComponent],
  imports: [
    CommonModule,
    SharedModule,
    // MaterialFileInputModule,
    RouterModule.forChild(emailRoutes)
  ]
})

export class SendEmailModule { }
