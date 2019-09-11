import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TestingComponent } from './testing.component';

const testingRoutes: Routes = [
  {
    path: '',
    component: TestingComponent,
    children: [
      {
        path: '',
        redirectTo: 'testing-list',
        pathMatch: 'full',
      },
      {
        path: 'testing-list',
        loadChildren: () => import('./testing-list/testing-list.module').then(module => module.TestingListModule)
      },
      {
        path: 'add-testing',
        loadChildren: () => import('./add-testing/add-testing.module').then(module => module.AddTestingModule),
      },
      {
        path: 'edit-testing/:testingId',
        loadChildren: () => import('./add-testing/add-testing.module').then(module => module.AddTestingModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [TestingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(testingRoutes)
  ]
})
export class TestingModule { }
