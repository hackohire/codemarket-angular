import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestingListComponent } from './testing-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const testingListRoutes: Routes = [
  {
    path: '',
    component: TestingListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [TestingListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(testingListRoutes)
  ]
})

export class TestingListModule { }
