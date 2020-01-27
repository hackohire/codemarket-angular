import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-business-coach-list',
  templateUrl: './business-coach-list.component.html',
  styleUrls: ['./business-coach-list.component.scss']
})
export class BusinessCoachListComponent implements OnInit {

  listOfBusinessCoaches: any[] = [];
  businessCoachPageNumber = 1;
  totalBusinessCoaches: number;

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  constructor(
    public postService: PostService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchBusinessCoaches(1);
  }

  fetchBusinessCoaches(pageNumber) {
    this.postService.getPostsByUserIdAndType(
      this.activatedRoute.queryParams['userId'] ? this.activatedRoute.queryParams['userId'] : this.authService.loggedInUser._id,
      '',
      'business-coach',
      {pageNumber, limit: 6}
    )
      .subscribe((dj) => {
        if (dj && dj.posts) {
          this.listOfBusinessCoaches = this.listOfBusinessCoaches.concat(dj.posts);
          // this.totalBusinessCoaches = dj.total;
        }
        // this.listOfBusinessCoaches = dj;
      });
  }

}
