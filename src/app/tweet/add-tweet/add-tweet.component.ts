import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { Company } from '../../shared/models/company.model';
import { Post } from '../../shared/models/post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TweetService } from '../../shared/services/tweet.service';
import { Subscription, of, Observable } from 'rxjs';

@Component({
  selector: 'app-add-tweet',
  templateUrl: './add-tweet.component.html',
  styleUrls: ['./add-tweet.component.scss']
})
export class AddTweetComponent implements OnInit {

  tweetForm: FormGroup;

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
    this.tweetFormInitialization();
  }

  tweetFormInitialization() {
    this.tweetForm = new FormGroup({
      tweetDesc: new FormControl('', Validators.required),
    })
    console.log('tweetform:'+ this.tweetForm);
  }
  async addTweet() {
    console.log('tweetform:'+ this.tweetForm);
    if (this.authService.loggedInUser._id) {
      this.tweetForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      //this.tweetForm.patchValue({ referenceId: tweetId });
      //this.subscription$.add(
        this.tweetService.tweet(this.tweetForm.value).subscribe((c) => {
          if (c) {
            console.log(c);
            this.tweetFormInitialization();
            this.router.navigate(['tweets-list']);
          }
        })
      //);
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }
}
