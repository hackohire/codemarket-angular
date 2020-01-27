import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { environment } from '../../../environments/environment';

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
    public postService: PostService
  ) { }

  ngOnInit() {
    this.fetchBusinessCoaches(1);
  }

  fetchBusinessCoaches(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 6}, 'business-coach').subscribe((dj) => {
      if (dj && dj.posts) {
        this.listOfBusinessCoaches = this.listOfBusinessCoaches.concat(dj.posts);
        this.totalBusinessCoaches = dj.total;
      }
    });
  }

}
