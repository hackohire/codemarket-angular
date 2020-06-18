import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { Company } from '../../shared/models/company.model';
import { Post } from '../../shared/models/post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EditorComponent } from '../../shared/components/editor/editor.component';
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
    public auth: AuthService,
    private tweetService: TweetService
  ) {
   }
  
  
   companyDetails: Post | Company | any;
   isUserAttending: boolean; /** Only for the event */
   subscription$: Subscription = new Subscription();
   type: string; // product | help-request | interview | requirement | Testing | Howtodoc
   anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
   s3FilesBucketURL = environment.s3FilesBucketURL;

  ngOnInit() {
  }
//
  //initializeTweetForm(p) {
  //  this.tweetForm = new FormGroup({
  //    referenceId: new FormControl(),
  //    companyReferenceId: new FormControl(p._id),
  //  });
//
  //  // this.commentService.getCommentsByReferenceId(p, this.commentId);
//
  //}

  async addTweet(tweetId = '',tweetEditor: EditorComponent) {
    console.log('tweetform:'+ this.tweetForm.value);
    console.log('tweetId:'+ tweetId);
    if (this.authService.loggedInUser) {
      this.tweetForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.tweetForm.patchValue({ referenceId: tweetId });
      this.subscription$.add(
        //this.tweetService.addTweet(tweetId,this.tweetForm.value).subscribe(c => {
        //  if (c) {
        //    tweetEditor.editor.clear();
        //  }
        //})
      );
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }
}