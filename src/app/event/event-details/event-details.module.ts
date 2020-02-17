import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from './event-details.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AddHowtodocModule } from '../../howtodoc/add-howtodoc/add-howtodoc.module';
import { AddHowtodocComponent } from '../../howtodoc/add-howtodoc/add-howtodoc.component';
import { AddAssignmentComponent } from '../../assignment/add-assignment/add-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: EventDetailsComponent,
    // data: { noReuse: true }
  }
];

@NgModule({
  declarations: [EventDetailsComponent, AddHowtodocComponent, AddAssignmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: []
})

export class EventDetailsModule { }
