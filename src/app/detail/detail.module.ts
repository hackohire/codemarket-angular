import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details/details.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent,
    // resolve: { seo: PostDataResolver },
    // data: { noReuse: true, setPostMeta: true },
    data: { noReuse: true }
  }
];


@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DetailModule { }
