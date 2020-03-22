import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddDesignComponent } from './add-design.component';
import { SharedModule } from 'src/app/shared/shared.module';

const addDesignRoutes: Routes = [
  {
    path: '',
    component: AddDesignComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddDesignComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addDesignRoutes)
  ]
})
export class AddDesignModule { }
