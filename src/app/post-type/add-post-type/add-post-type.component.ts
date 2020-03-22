import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AppState } from '../../core/store/state/app.state';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { CompanyPostTypes } from '../../shared/models/post-types.enum';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { Post } from '../../shared/models/post.model';


@Component({
  selector: 'app-add-post-type',
  templateUrl: './add-post-type.component.html',
  styleUrls: ['./add-post-type.component.scss']
})
export class AddPostTypeComponent implements OnInit {
  breadcumb: BreadCumb;
  postTypeForm: FormGroup;

  get createdBy() {
    return this.postTypeForm.get('createdBy');
  }

  get idFromControl() {
    return this.postTypeForm.get('_id');
  }

  get descriptionFormControl() {
    return this.postTypeForm.get('description');
  }

  get statusFormControl() {
    return this.postTypeForm.get('status');
  }

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  subscription$: Subscription;

  fields = [
    /** Common Fields */
    { field: { name: 'price' }, selected: false }, /** Only in Bugfix */
    { field: { name: 'tags' }, selected: false }, /** Goal, interview, bugfix, requiremente & etc. */
    { field: { name: 'cities' }, selected: false }, /** dream-job & job & etc */
    { field: { name: 'company' }, selected: false }, /** dream-job & career-coach & business-coach & funding-process */
    { field: { name: 'companies' }, selected: false }, /** job & etc */
    { field: { name: 'jobProfile' }, selected: false }, /** business-coach & career-coach */
    { field: { name: 'timeline' }, selected: false }, /** dream-job */

    /** Fields for career-coach */
    { field: { name: 'gapAnalysis', label: 'I can do resume gap analysis' }, selected: false },
    { field: { name: 'careerCoachSessions', label: 'I can take part in weekly 30 mins career coach sessions' }, selected: false },
    { field: { name: 'helpingWithMockInterviews', label: 'I can take part in helping with mock interviews' }, selected: false },
    { field: { name: 'hiringMentoringSessions', label: 'I can take part in hiring mentoring sessions' }, selected: false },

    /** Fields for business-coach */
    { field: { name: 'businessCoachSessions', label: 'Can You Take Part In Weekly 30 Mins Business Coaching?' }, selected: false },
    { field: { name: 'businessAreas', label: 'In what business areas can you provide business coaching?' }, selected: false },
    { field: { name: 'businessGoals', label: 'What business goals can you help with your coaching?' }, selected: false },
    { field: { name: 'businessChallenges', label: 'What business challenges can you give coaching for?' }, selected: false },
    { field: { name: 'sellProducts', label: 'Do you sell any products?' }, selected: false },
    { field: { name: 'sellServices', label: 'Do you sell any services?' }, selected: false },

    /** Fields for capital-funding */
    { field: { name: 'fundingDate' }, selected: false },
    { field: { name: 'fundingCurrency' }, selected: false },
    { field: { name: 'fundingAmount' }, selected: false },
    { field: { name: 'fundingBy' }, selected: false },
    { field: { name: 'fundingTo' }, selected: false },
    { field: { name: 'fundingProcess' }, selected: false },

    /** Field for hiring-process */
    { field: { name: 'hiringProcess' }, selected: false },

    /** Fields to add collaborator to the post */
    { field: { name: 'collaborators' }, selected: false },

    /** Field to add assignees to the post */
    { field: { name: 'assignees' }, selected: false }
  ];

  get fieldsFormControl() {
    return this.postTypeForm.get('fields') as FormArray;
  }


  constructor(
    private authService: AuthService,
  ) {

    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: 'Add Company Post Details',
      path: [
        {
          name: CompanyPostTypes.CompanyPost
        }
      ]
    };

    // this.postTypeFormInitialization();
  }

  ngOnInit() {
    this.postTypeFormInitialization(null);
  }

  postTypeFormInitialization(i: Post) {
    this.postTypeForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', [Validators.required, Validators.pattern('^[a-zA-Z]+[ ,-]?([a-zA-Z]+$){1}')]),
      // fields: new FormArray([]),
      description: new FormControl(i && i.description ? i.description : []),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      type: new FormControl(),
    });

    const fieldsFormControl = this.fields.map((f => {
      return new FormGroup(
        {
          field: new FormGroup(
            {
              name: new FormControl(f.field.name), label: new FormControl(f.field.label)
            }
          ),
          selected: new FormControl(f.selected)
        });
    }));

    console.log(fieldsFormControl);

    this.postTypeForm.addControl('fields', new FormArray(fieldsFormControl));
  }


  async submit(status) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.statusFormControl.setValue(status);

    const blocks = await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.postTypeForm.removeControl('_id');
    } else {
    }
  }
}
