import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { EditorComponent } from '../editor/editor.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommentService } from '../../services/comment.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  @Input() commentForm: FormGroup;
  @Input() showLabel: false;
  subscription$ = new Subscription();

  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  constructor(
    public authService: AuthService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
  }
  async addComment(addCommentEditor: EditorComponent) {
    if (this.authService.loggedInUser) {
      const blocks = await addCommentEditor.editor.save();
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
}
