import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventEmitter } from 'events';
import { BlockToolData } from '@editorjs/editorjs';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() referenceId: string;
  @Output() updateRoot: EventEmitter = new EventEmitter();
  replyCommentForm: FormGroup;
  reply: boolean;
  replyEditorId: string;
  replyTextEditorData: BlockToolData;

  constructor(
    private authService: AuthService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    console.log(this.comment);
    this.initializeReplyForm();

  }


  initializeReplyForm() {
    this.replyCommentForm = new FormGroup({
      text: new FormControl(this.comment.text),
      createdBy: new FormControl(this.authService.loggedInUser._id),
      referenceId: new FormControl(this.comment.referenceId),
      parentId: new FormControl(this.comment._id),
      type: new FormControl(this.comment.type)
    });
  }


  fromNow(date) {
    const d = new Date(+date);
    return moment(d).fromNow();
  }

  allowReply() {
    this.initializeReplyForm();
    this.replyEditorId = new Date().toDateString();
    this.reply = true;
  }

  updateFormData(event) {
    this.replyCommentForm.get('text').setValue(event);
  }


  addReply() {
    // console.log(this.commentForm.value);
    this.commentService.addComment(this.replyCommentForm.value).pipe(
      // switchMap((d) => {
      //   return this.productService.getCommentsByReferenceId(d.referenceId);
      // }),
      tap((child) => {
        if (child && this.comment.children) {
          this.comment.children.push(child);
          this.replyCommentForm.reset();
          this.replyTextEditorData = null;
          this.reply = false;
        }
      })
    ).subscribe();
  }

}
