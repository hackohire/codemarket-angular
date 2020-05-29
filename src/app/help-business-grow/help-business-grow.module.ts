import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpBusinessGrowComponent } from './help-business-grow.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HelpBusinessGrowComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: HelpBusinessGrowComponent
    }])
  ]
})
export class HelpBusinessGrowModule { }
