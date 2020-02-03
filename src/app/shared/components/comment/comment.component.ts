import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { BlockToolData } from '@editorjs/editorjs';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';
import { environment } from 'src/environments/environment';
import { SweetalertService } from '../../services/sweetalert.service';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [CommentService]
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() referenceId: string;
  @Input() companyReferenceId: string;
  @Input() postCreatedBy: string;
  // @Output() commentDeleted  = new EventEmitter();
  @Output() allowReplyToParent = new EventEmitter();
  replyCommentForm: FormGroup;
  reply: boolean;
  edit: boolean;
  replyEditorId: string;

  @ViewChild('commentReplyEditor', {static: false}) commentReplyEditor: EditorComponent;

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  constructor(
    public authService: AuthService,
    private commentService: CommentService,
    private sweetAlertService: SweetalertService
  ) { }

  ngOnInit() {
    this.initializeReplyForm();
  }


  initializeReplyForm() {
    this.replyCommentForm = new FormGroup({
      text: new FormControl(this.comment.text),
      // createdBy: new FormControl(this.authService.loggedInUser._id),
      referenceId: new FormControl(this.comment.referenceId),
      companyReferenceId: new FormControl(this.companyReferenceId ? this.companyReferenceId : this.comment.companyReferenceId),
      parentId: new FormControl(this.comment._id),
      type: new FormControl(this.comment.type),
      blockSpecificComment: new FormControl(this.comment.blockSpecificComment),
      blockId: new FormControl(this.comment.blockId)
    });
  }


  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  allowReply() {
    if (!this.comment.parentId && !this.comment.companyReferenceId) {
      this.initializeReplyForm();
      // this.replyEditorId = new Date().toDateString();
      this.reply = true;
    } else {
      this.allowReplyToParent.emit();
    }
  }

  async addReply(commentReplyEditor: EditorComponent) {
    if (this.authService.loggedInUser) {
      const blocks =  await commentReplyEditor.editor.save();
      this.replyCommentForm.get('text').setValue(blocks.blocks);
      this.replyCommentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentService.addComment(this.replyCommentForm.value).pipe(
        tap((child) => {
          if (child && this.comment.children) {
            // this.comment.children.push(child);
            // this.reply = false;
            commentReplyEditor.editor.blocks.clear();
          }
        })
      ).subscribe();
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  deleteComment() {
    this.sweetAlertService.confirmDelete(() => {
    this.commentService.deleteComment(this.comment._id).pipe(
      tap((d) => {
        // this.commentDeleted.emit(this.comment._id);
        // this.comment = null;
        this.replyCommentForm = null;
      })
    ).subscribe();
    });
  }

  async updateComment(singleCommentEditor: EditorComponent) {
    const blocks =  await singleCommentEditor.editor.save();
    this.replyCommentForm.get('text').setValue(blocks.blocks);

    this.commentService.updateComment(this.comment._id, this.replyCommentForm.get('text').value).pipe(
      tap((d) => {
        if (d) {
          this.edit = false;
        }
      })
    ).subscribe();
  }

}
