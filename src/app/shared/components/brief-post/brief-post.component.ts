import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../models/post.model';
import moment from 'moment';
import { PostService } from '../../services/post.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-brief-post',
  templateUrl: './brief-post.component.html',
  styleUrls: ['./brief-post.component.scss']
})
export class BriefPostComponent implements OnInit {
  @Input() p: Post;
  @Output() delete = new EventEmitter();
  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;
  
  constructor(
    public postService: PostService,
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  deletePost(postId) {
    this.postService.deletePost(postId).subscribe(d => {
      if (d) {
        this.delete.emit(postId);
      }
    });
  }

}
