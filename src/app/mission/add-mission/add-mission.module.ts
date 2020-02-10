import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMissionComponent } from './add-mission.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addMissionRoutes: Routes = [
  {
    path: '',
    component: AddMissionComponent,
  },
];

@NgModule({
  declarations: [AddMissionComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addMissionRoutes)
  ]
})
export class AddMissionModule { }
