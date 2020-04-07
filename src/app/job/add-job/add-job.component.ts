import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription, of, } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { SetSelectedPost, GetPostById, AddPost, UpdatePost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, switchMap, } from 'rxjs/operators';
import { Post } from '../../shared/models/post.model';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import { EditorComponent } from '../../shared/components/editor/editor.component';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent implements OnInit, OnDestroy {

  breadcumb: BreadCumb;
  jobForm: FormGroup;

  get createdBy() {
    return this.jobForm.get('createdBy');
  }

  get idFromControl() {
    return this.jobForm.get('_id');
  }

  get descriptionFormControl() {
    return this.jobForm.get('description');
  }

  get citiesFormControl() {
    return this.jobForm.get('cities') as FormArray;
  }

  get statusFormControl() {
    return this.jobForm.get('status');
  }

  subscription$: Subscription;

  // public dialogRef = null;
  // public data;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public formService: FormService,
  ) {
    // this.dialogRef = this.injector.get(MatDialogRef, null);
    // this.data = this.injector.get(MAT_DIALOG_DATA, null);

    this.breadcumb = {
      title: 'Add Job Details',
      path: [

        {
          name: PostType.Job
        }
      ]
    };

    const referencePostId = this.activatedRoute.snapshot.queryParams['referencePostId'];

    /** If it is "add-job" route intialize empty job form, but we are setting store property of "Selectedjob" as null
     * and if it is "edit-job route" we need to subscribe to get "Selectedjob" and user refresh the tab,
     * there won't be any selected job,
     * so we need to make the call to
     * get the job by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig && this.activatedRoute.snapshot.parent.routeConfig.path === `add-${PostType.Job}`) {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.jobFormInitialization(null, referencePostId);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.jobFormInitialization(h, referencePostId);
        }),
        switchMap((h: Post) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ jobId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected job, so we need to make the call to
           * get the job by fetching id from the params
           */
          if (params.jobId) {
            this.store.dispatch(GetPostById({ postId: params.jobId }));
          }
        })
      ).subscribe();
    }

    // this.jobFormInitialization();
  }

  ngOnDestroy() {
    // this.store.dispatch(SetSelectedPost({ post: null }));
  }

  ngOnInit() { }

  jobFormInitialization(i: Post, referencePostId = '') {
    this.jobForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      jobProfile: new FormControl(i && i.jobProfile ? i.jobProfile : []),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      cities: new FormControl(i && i.cities && i.cities.length ? i.cities : []),
      salaryCurrency: new FormControl(i && i.salaryCurrency ? i.salaryCurrency : '$'),
      salaryRangeFrom: new FormControl(i && i.salaryRangeFrom ? i.salaryRangeFrom : 10),
      salaryRangeTo: new FormControl(i && i.salaryRangeTo ? i.salaryRangeTo : 30),
      type: new FormControl(PostType.Job),
      referencePostUrl: new FormControl(i && i.referencePostUrl ? i.referencePostUrl : ''),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
    });

    if (referencePostId) {
      this.jobForm.addControl('referencePostId', new FormControl(referencePostId));
    }
  }

  async submit(status) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.statusFormControl.setValue(status);

    const blocks =  await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.jobForm.removeControl('_id');
      const jobValue = { ...this.jobForm.value };
      this.onlySendIdForTags(jobValue);
      this.store.dispatch(AddPost({ post: jobValue }));
    } else {
      const jobValue = { ...this.jobForm.value };
      this.onlySendIdForTags(jobValue);
      this.store.dispatch(UpdatePost({ post: jobValue }));
    }
  }

  onlySendIdForTags(jobValue) {
    jobValue.cities = jobValue.cities.map(c => c._id);
    jobValue.jobProfile = jobValue.jobProfile.map(c => c._id);
  }

  updateFormData(event) {
    console.log(event);
    this.jobForm.get('description').setValue(event);
  }

  addTagFn(name) {
    return name;
  }

  addCitiesFn(name) {
    return { name };
  }

}
