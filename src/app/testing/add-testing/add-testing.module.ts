import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddTestingComponent } from './add-testing.component';
import { SharedModule } from 'src/app/shared/shared.module';

const addTestingRoutes: Routes = [
  {
    path: '',
    component: AddTestingComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddTestingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addTestingRoutes)
  ]
})
export class AddTestingModule { }
