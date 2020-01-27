import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { environment } from '../../../environments/environment';

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
    public postService: PostService
  ) { }

  ngOnInit() {
    this.fetchCareerCoaches(1);
  }

  fetchCareerCoaches(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 6}, 'career-coach').subscribe((dj) => {
      if (dj && dj.posts) {
        this.listOfCareerCoaches = this.listOfCareerCoaches.concat(dj.posts);
        this.totalCareerCoaches = dj.total;
      }
    });
  }

}
