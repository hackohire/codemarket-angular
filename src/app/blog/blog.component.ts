import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { HelpQuery } from '../shared/models/help-query.model';
import { MatSort, MatPaginator } from '@angular/material';
import { UserService } from '../user/user.service';
import { PostService } from '../shared/services/post.service';
import { AuthService } from '../core/services/auth.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MembershipService } from '../membership/membership.service';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  listOfConnectedPosts: { posts: Post[], total?: number } = { posts: [] };
  totalConnectedPosts: number;
  paginator: MatPaginator;
  isShowDiv1 = true;
  isShowDiv2 = true;
  isShowDiv3 = true;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
  }

  toggleDisplayDiv1() { this.isShowDiv1 = !this.isShowDiv1; }
  toggleDisplayDiv2() { this.isShowDiv2 = !this.isShowDiv2; }
  toggleDisplayDiv3() { this.isShowDiv3 = !this.isShowDiv3; }

  getConnectedPosts(postType) {

    if (this.paginator) {
      const paginationObj = {
        pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
        sort: { order: '' }
      };
      this.postService.getAllPosts(
        paginationObj, 'blog', '', '',
      ).subscribe((u) => {
        this.listOfConnectedPosts.posts = u.posts;
        this.totalConnectedPosts = u.total;
      });

    }

  }
}
