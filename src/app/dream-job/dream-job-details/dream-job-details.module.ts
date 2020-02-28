import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DreamJobDetailsComponent } from './dream-job-details.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DreamJobDetailsComponent,
    data: { noReuse: true }
  }
];

@NgModule({
  declarations: [DreamJobDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: []
})
export class DreamJobDetailsModule { }
