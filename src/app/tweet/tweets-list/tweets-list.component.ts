import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { Subscription } from 'rxjs';
import { Tweet } from '../../shared/models/tweet.model';
import { AuthService } from '../../core/services/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { GetPostsByUserIdAndType, GetPostsByType, DeletePost } from '../../core/store/actions/post.actions';
import { selectPostsByUserIdAndType, selectPostsByType } from '../../core/store/selectors/post.selectors';
import { TweetService } from '../../shared/services/tweet.service';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { startCase } from 'lodash';
import { selectLoggedInUser } from '../../core/store/selectors/user.selector';
import { SweetalertService } from '../../shared/services/sweetalert.service';

@Component({
  selector: 'app-tweets-list',
  templateUrl: './tweets-list.component.html',
  styleUrls: ['./tweets-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TweetsListComponent implements OnInit {

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedTweets: Tweet | null;
  all: boolean;
  authorId: string;
  breadcumb: BreadCumb;
  tweetsList = [];

  tweetsListSubscription:Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public authService: AuthService,
    private store: Store<AppState>,
    public tweetservice: TweetService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService
  ) {  } 

  ngOnInit() {
    //console.log(this.authService.loggedInUser._id);
    this.tweetservice.getTweets('5ee3664cfd99a6255029b0db').subscribe(e => {
      console.log("Inside getTweets");
      console.log(e);
      this.tweetsList = e;
    });
  }

}
