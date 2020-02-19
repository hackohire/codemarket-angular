import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { AuthService } from '../../core/services/auth.service';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { Email } from '../../shared/models/email.model';
import { EmailService } from '../email.service';
import { ActivatedRoute } from '@angular/router';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';

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
    private activatedRoute: ActivatedRoute
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

    /** If company is set add the company link */
    // if (this.emailForm.get('company')) {
    //   blocks.blocks.push({
    //     type: 'paragraph',
    //     data: {
    //       text: `<div style="padding-top: 20px;">Company: <a href="https://${window.location.host}/company/${this.companyFormControl.value._id}">
    //               ${this.companyFormControl.value.name}</a></div>`
    //     }
    //   });
    // }

    /** Set the updated description blocks */
    this.descriptionFormControl.setValue(blocks.blocks);

    this.changeDetector.detectChanges();


    this.descriptionHTMLFormControl.setValue(this.descriptionEditor.editorViewRef.nativeElement.innerHTML);

    this.emailForm.get('to').setValue(this.emailForm.get('to').value.map(element => element.label ? element.label : element));
    this.emailForm.get('cc').setValue(this.emailForm.get('cc').value.map(element => element.label ? element.label : element));
    this.emailForm.get('bcc').setValue(this.emailForm.get('bcc').value.map(element => element.label ? element.label : element));

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    this.emailService.sendEmail(this.emailForm.value).subscribe(e => console.log(e));

  }

}
