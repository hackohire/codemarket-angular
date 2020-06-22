import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { TweetService } from '../../shared/services/tweet.service';
import { Subscription, of, Observable } from 'rxjs';
import { Tweet } from 'src/app/shared/models/tweet.model';

@Component({
  selector: 'app-tweets-list',
  templateUrl: './tweets-list.component.html',
  styleUrls: ['./tweets-list.component.scss']
})
export class TweetsListComponent implements OnInit {

  userId = String;

  listOfTweets: { tweets: Tweet[], total?: number } = { tweets: [] };
  totalTweets: number;
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
    if (this.authService.loggedInUser._id) {
      //console.log(this.authService.loggedInUser._id);
      this.tweetService.fetchTweets(this.authService.loggedInUser._id).subscribe(e => {
        console.log("Inside getTweets");
        console.log(e);
        this.tweetsList = e;
        //this.listOfTweets.tweets = e.tweets;
        //this.totalTweets = e.total;
      });
    }
    
  }
}
