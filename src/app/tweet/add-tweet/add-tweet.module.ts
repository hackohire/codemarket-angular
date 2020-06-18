import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { AddTweetComponent } from './add-tweet.component';
import { TweetsListComponent } from '../tweets-list/tweets-list.component';

const tweetRoutes: Routes = [
  {
    children: [
      {
        path: 'tweet-list',
        component: TweetsListComponent
      },
      {
        path: 'add-tweet',
        component: AddTweetComponent,
        canLoad: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  declarations: [AddTweetComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: AddTweetComponent
    }])
  ]
})

export class AddTweetModule { }
