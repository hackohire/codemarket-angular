import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetsListComponent } from './tweets-list.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TweetsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: TweetsListComponent
    }])
  ]
})

export class TweetsListModule { }
