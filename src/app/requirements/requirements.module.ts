import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RequirementsComponent } from './requirements.component';





const requirementRoutes: Routes = [
  {
    path: '',
    component: RequirementsComponent,
    children: [
      {
        path: '',
        redirectTo: 'post-list',
        pathMatch: 'full',
      },
      {
        path: 'post-list',
        loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'add-requirement',
        loadChildren: () => import('./add-requirements/add-requirement.module').then(module => module.AddRequirementModule),
      },
      {
        path: 'edit-requirement/:requirementId',
        loadChildren: () => import('./add-requirements/add-requirement.module').then(module => module.AddRequirementModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [RequirementsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(requirementRoutes)
  ]
})
export class RequirementsModule { }
