import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';
import { environment } from 'src/environments/environment';
import { SweetalertService } from '../../services/sweetalert.service';
import { EditorComponent } from '../editor/editor.component';
import uniqBy from 'lodash/uniqBy';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() referenceId: string;
  @Input() companyReferenceId: string;
  @Input() fromWhere: string;
  @Input() isChildComment: boolean;
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
    private sweetAlertService: SweetalertService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initializeReplyForm();
  }


  initializeReplyForm() {
    this.replyCommentForm = new FormGroup({
      text: new FormControl([]),
      // createdBy: new FormControl(this.authService.loggedInUser._id),
      referenceId: new FormControl(this.comment.referenceId),
      companyReferenceId: new FormControl(this.companyReferenceId ? this.companyReferenceId : this.comment.companyReferenceId),
      // userReferenceId: new FormControl(this.userReferenceId ? this.userReferenceId : this.comment.userReferenceId),
      parentId: new FormControl(this.comment._id),
      type: new FormControl(this.comment.type),
      blockSpecificComment: new FormControl(this.comment.blockSpecificComment),
      blockId: new FormControl(this.comment.blockId),
      textHTML: new FormControl(this.comment.textHTML)
    });
  }


  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  allowReply() {
    if (!this.comment.parentId) {
      this.initializeReplyForm();
      // this.replyEditorId = new Date().toDateString();
      this.reply = true;
    } else {
      this.allowReplyToParent.emit();
    }
  }

  async addReply(commentReplyEditor: EditorComponent) {
    if (this.authService.loggedInUser) {
      // const blocks =  await commentReplyEditor.editor.save();

      // this.replyCommentForm.get('text').setValue(blocks.blocks);

      // this.changeDetector.detectChanges();


      /** Fetch the html content also becuase when we send email, email only understands the html content so we need to store html
       * content also
       */
      this.replyCommentForm.get('textHTML').setValue(commentReplyEditor.html ? commentReplyEditor.html : commentReplyEditor.editorUI);


      this.replyCommentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentService.addComment(this.replyCommentForm.value).pipe(
        tap((child) => {
          if (child && this.comment.children) {
            // this.comment.children.push(child);
            commentReplyEditor.html = '';
            this.reply = this.fromWhere === 'chat' ? false : true;
            // commentReplyEditor.editor.blocks.clear();
          }
        })
      ).subscribe();
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  deleteComment(singleCommentEditor: EditorComponent) {
    this.sweetAlertService.confirmDelete(() => {
    this.commentService.deleteComment(this.comment._id, this.comment.referenceId, singleCommentEditor.html).pipe(
      tap((d) => {
        // this.commentDeleted.emit(this.comment._id);
        // this.comment = null;
        this.replyCommentForm = null;
      })
    ).subscribe();
    });
  }

  async updateComment(singleCommentEditor: EditorComponent) {
    // const blocks =  await singleCommentEditor.editor.save();
    // this.comment.text = blocks.blocks;

    // this.changeDetector.detectChanges();

    await this.commentService.updateComment(
      this.comment._id,
      this.comment.referenceId,
      this.comment.text,
      singleCommentEditor.html ? singleCommentEditor.html : singleCommentEditor.editorUI
      // singleCommentEditor.editorViewRef.nativeElement.innerHTML
    ).pipe(
      tap((d) => {
        if (d) {
          this.edit = false;
        }
      })
    ).toPromise();
  }

  fetchCommentators(children) {
    return uniqBy(children, '_id');
  }

}
