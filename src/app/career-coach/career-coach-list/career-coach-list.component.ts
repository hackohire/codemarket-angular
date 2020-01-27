import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-career-coach-list',
  templateUrl: './career-coach-list.component.html',
  styleUrls: ['./career-coach-list.component.scss']
})
export class CareerCoachListComponent implements OnInit {

  listOfCareerCoaches: any[] = [];
  careerCoachPageNumber = 1;
  totalCareerCoaches: number;

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  constructor(
    public postService: PostService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchCareerCoaches(1);
  }

  fetchCareerCoaches(pageNumber) {
    this.postService.getPostsByUserIdAndType(
      this.activatedRoute.queryParams['userId'] ? this.activatedRoute.queryParams['userId'] : this.authService.loggedInUser._id,
      '',
      'career-coach',
      {pageNumber, limit: 6},
      ).subscribe((dj) => {
      if (dj && dj.posts) {
        this.listOfCareerCoaches = this.listOfCareerCoaches.concat(dj.posts);
        this.totalCareerCoaches = dj.total;
      }
    });
    // this.postService.getPostsByUserIdAndType(
    //   this.activatedRoute.queryParams['userId'] ? this.activatedRoute.queryParams['userId'] : this.authService.loggedInUser._id,
    // '', 'career-coach').subscribe((cc) => {
    //   this.listOfCareerCoaches = cc;
    // })
  }

}
