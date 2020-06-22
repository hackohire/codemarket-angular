import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { TweetService } from '../../shared/services/tweet.service';
import { Subscription, of, Observable } from 'rxjs';
import { Tweet } from 'src/app/shared/models/tweet.model';
import moment from 'moment';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-tweets-list',
  templateUrl: './tweets-list.component.html',
  styleUrls: ['./tweets-list.component.scss']
})
export class TweetsListComponent implements OnInit {

  userId = String;

  listOfTweets: { tweets: Tweet[], total?: number, currentUser?: User } = { tweets: [] };
  totalTweets: number;
  currentUser: User;
  paginator: MatPaginator;

  tweetsList: Tweet[];

  constructor(
    public authService: AuthService,
    private router: Router,
    private tweetService: TweetService
  ) { }

  subscription$: Subscription = new Subscription();
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;
  
  ngOnInit() {
    console.log("Inside ngOnInit");
    this.fetchTweets();
  }

  /** Fetch the list of tweets for the tweets tab based on the pagination */
  fetchTweets() {
    this.authService.loggedInUser$.subscribe((u) => {
      // if (this.authService.loggedInUser._id) {
        // console.log("111111 ==> ", this.authService.loggedInUser._id);
        if (u) {
          this.tweetService.fetchTweets(u._id).subscribe(e => {
            console.log("Inside getTweets");
            console.log(e);
            this.tweetsList = e;
            this.listOfTweets.tweets = e;
            this.listOfTweets.total = e.length;
            this.listOfTweets.currentUser = u;
            console.log('List '+this.listOfTweets.total);
          });
        }
      // }
    });
    
  }
  
  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }
}
