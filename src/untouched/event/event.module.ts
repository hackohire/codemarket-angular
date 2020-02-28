import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EventComponent } from './event.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const eventRoutes: Routes = [
  {
    path: '',
    component: EventComponent,
    children: [
      {
        path: '',
        redirectTo: 'post-list',
        pathMatch: 'full',
      },
      // {
      //   path: 'event-list',
      //   loadChildren: () => import('./event-list/event-list.module').then(module => module.EventListModule)
      // },
      {
        path: 'post-list',
        loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'add-event',
        loadChildren: () => import('./add-event/add-event.module').then(module => module.AddEventModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'edit-event/:eventId',
        loadChildren: () => import('./add-event/add-event.module').then(module => module.AddEventModule),
        canLoad: [AuthGuard]
      }
    ]
  },
];


@NgModule({
  declarations: [EventComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(eventRoutes)
  ]
})
export class EventModule { }
