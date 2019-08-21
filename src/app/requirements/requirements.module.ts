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
        redirectTo: 'requirements-list',
        pathMatch: 'full',
      },
      {
        path: 'requirements-list',
        loadChildren: () => import('./requirement-list/requirement-list.module').then(module => module.RequirementListModule)
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
