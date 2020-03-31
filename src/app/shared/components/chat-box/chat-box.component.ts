import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  providers: [CommentService]
})
export class ChatBoxComponent implements OnInit, AfterViewInit {
 
  @Input() comments: Comment[];
  @Input() loggedInUserId;

  @Input() postDetails;

  commentForm: FormGroup;
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  commentId: string;
  blockId: string;
  selectedBlock = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    public commentService: CommentService,
  ) { }

  ngOnInit() {
    console.log("THis is commentData in ngOnInit ==> ", this.commentService.commentsList$);
  }

  ngAfterViewInit() {
    console.log("THis is postDetails in ngAfterViewInit ==> ", this.postDetails);
  }

  initializeCommentForm(p, commentType?: string) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(commentType ? commentType : this.type),
    });

    this.commentService.getCommentsByReferenceId(p, this.commentId);

    if (this.blockId) {
      this.selectedBlock = this.postDetails.description.find((b: any) => b._id === this.blockId);
      console.log(this.selectedBlock);
    }

  }

}
