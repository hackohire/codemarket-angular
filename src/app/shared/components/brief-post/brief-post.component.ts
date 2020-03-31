import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Post } from '../../models/post.model';
import moment from 'moment';
import { PostService } from '../../services/post.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../services/comment.service';
import { EditorComponent } from '../editor/editor.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brief-post',
  templateUrl: './brief-post.component.html',
  styleUrls: ['./brief-post.component.scss'],
  providers: [CommentService]
})
export class BriefPostComponent implements OnInit, OnDestroy {
  @Input() p: Post;

  @Input() readMore: boolean;

  commentForm: FormGroup;

  @Output() delete = new EventEmitter();
  @Output() showComments = new EventEmitter();

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;
  subscription$ = new Subscription();

  constructor(
    public postService: PostService,
    public authService: AuthService,
    public commentService: CommentService
  ) { }

  ngOnInit() {
    this.initializeCommentForm(this.p);
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

  /** Fetch comments related to the post */
  fetchComments(post) {
    this.commentService.getCommentsByReferenceId(post);
  }

  /** Check if user is loggedin or not, if loggedin allow to comment, otherwise open the login popup UI */
  async addComment(addCommentEditor: EditorComponent) {
    if (this.authService.loggedInUser) {
      const blocks =  await addCommentEditor.editor.save();
      this.commentForm.get('text').setValue(blocks.blocks);
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));

      this.subscription$.add(
        this.commentService.addComment(this.commentForm.value).subscribe((c) => {
          addCommentEditor.editor.clear();
        })
      );
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  /** Comment form initialization for adding comment */
  initializeCommentForm(p, commentType?: string) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl('post'),
    });

  }

  /** Destroy subscriptions */
  ngOnDestroy() {
    this.commentService.unsubscribe();
    this.subscription$.unsubscribe();
  }

}
