import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { AuthService } from '../../core/services/auth.service';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { Email } from '../../shared/models/email.model';
import { EmailService } from '../email.service';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import Swal from 'sweetalert2';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  breadcumb: BreadCumb;
  emailForm: FormGroup;

  get createdBy() {
    return this.emailForm.get('createdBy');
  }

  get descriptionFormControl() {
    return this.emailForm.get('description');
  }

  get descriptionHTMLFormControl() {
    return this.emailForm.get('descriptionHTML');
  }

  get companyFormControl() {
    return this.emailForm.get('company');
  }

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  subscription$: Subscription;

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private changeDetector: ChangeDetectorRef,
    private postService: PostService
  ) {

    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: 'Send Email',
      path: [
        {
          name: 'send email'
        }
      ]
    };
  }

  ngOnInit() {
    this.emailFormInitialization(null);
  }

  emailFormInitialization(i: Email) {
    this.emailForm = new FormGroup({
      to: new FormControl([], Validators.required),
      cc: new FormControl([]),
      bcc: new FormControl([]),
      company: new FormControl(),
      dateRange: new FormControl([], Validators.required),
      subject: new FormControl('', Validators.required),
      type: new FormControl(PostType.Email),
      status: new FormControl(PostStatus.Published),
      description: new FormControl([]),
      descriptionHTML: new FormControl(),
      createdBy: new FormControl(''),
      // type: new FormControl(PostType.Assignment),
    });
  }


  async submit() {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    /** Fetch description blocks */
    const blocks = await this.descriptionEditor.editor.save();

    /** Set the updated description blocks */
    this.descriptionFormControl.setValue(blocks.blocks);

    /** Here we are asking to detectchanges again because when we fetch the blocks to save the description in formcontrol,
     * we need the HTML also, so for that detectchanges will render the changes again with saved block and we can access the html again
     */
    this.changeDetector.detectChanges();


    /** Fetch the html content also becuase when we send email, email only understands the html content so we need to store html
     * content also
     */
    this.descriptionHTMLFormControl.setValue(this.descriptionEditor.editorViewRef.nativeElement.innerHTML);

    this.emailForm.get('to').setValue(this.emailForm.get('to').value.map(element => element.label ? element.label : element));
    this.emailForm.get('cc').setValue(this.emailForm.get('cc').value.map(element => element.label ? element.label : element));
    this.emailForm.get('bcc').setValue(this.emailForm.get('bcc').value.map(element => element.label ? element.label : element));

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    /** Send the email and redirect to actual email post */
    this.emailService.sendEmail(this.emailForm.value).subscribe(e => {
      if (e) {
        Swal.fire(`Emai has been Send Successfully`, '', 'success').then(() => {
          this.postService.redirectToPostDetails(e);
        });
      }
    });

  }

}
