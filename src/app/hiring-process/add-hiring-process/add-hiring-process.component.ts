import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Subscription, of, } from 'rxjs';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { SetSelectedPost, GetPostById } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, switchMap, } from 'rxjs/operators';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import { AppState } from '../../core/store/state/app.state';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../shared/services/post.service';
import { EditorComponent } from '../../shared/components/editor/editor.component';

@Component({
  selector: 'app-add-hiring-process',
  templateUrl: './add-hiring-process.component.html',
  styleUrls: ['./add-hiring-process.component.scss'],
})

export class AddHiringProcessComponent implements OnInit {

  breadcumb: BreadCumb;
  hiringprocessForm: FormGroup;

  get createdBy() {
    return this.hiringprocessForm.get('createdBy');
  }

  get idFromControl() {
    return this.hiringprocessForm.get('_id');
  }

  get descriptionFormControl() {
    return this.hiringprocessForm.get('description');
  }

  get citiesFormControl() {
    return this.hiringprocessForm.get('cities') as FormArray;
  }

  get statusFormControl() {
    return this.hiringprocessForm.get('status');
  }

  get process(): FormArray {
    return this.hiringprocessForm.get('hiringProcess') as FormArray;
  }

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;
  @ViewChildren('steps') steps: QueryList<EditorComponent>;

  subscription$: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public postService: PostService
  ) {
    this.breadcumb = {
      title: 'Add Hiring Process',
      path: [

        {
          name: PostType.HiringProcess
        }
      ]
    };

    /** If it is "add-hiringprocess" route intialize empty hiringprocess form, but we are setting store property of "Selectedhiringprocess" as null
     * and if it is "edit-hiringprocess route" we need to subscribe to get "Selectedhiringprocess" and user refresh the tab,
     * there won't be any selected hiringprocess,
     * so we need to make the call to
     * get the hiringprocess by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig.path === `add-${PostType.HiringProcess}`) {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.hiringprocessFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.hiringprocessFormInitialization(h);
        }),
        switchMap((h: Post) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ hiringProcessId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected hiringprocess, so we need to make the call to
           * get the hiringprocess by fetching id from the params
           */
          if (params.hiringProcessId) {
            this.store.dispatch(GetPostById({ postId: params.hiringProcessId }));
          }
        })
      ).subscribe();
    }

    // this.hiringprocessFormInitialization();
  }

  ngOnInit() {
  }

  setProcessFormControl(hiringProcessSteps: any[]) {
    const hiringProcessStepsControls = [];
    hiringProcessSteps.forEach((s) => {
      hiringProcessStepsControls.push(new FormControl(s));
    });
    return hiringProcessStepsControls;
  }

  hiringprocessFormInitialization(i: Post) {
    console.log(i && i.companies ? i.companies : []);
    this.hiringprocessForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      jobProfile: new FormControl(i && i.jobProfile ? i.jobProfile : []),
      description: new FormControl(i && i.description ? i.description : ''),
      company: new FormControl(i && i.company ? i.company : []),
      hiringProcess: new FormArray(i && i.hiringProcess ? this.setProcessFormControl(i.hiringProcess) : [new FormControl([])]),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      type: new FormControl(PostType.HiringProcess),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
    });
  }

  async submit(status) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.statusFormControl.setValue(status);

    /** Setting Up Steps Data Runtime while saving the form.by accessing the editor references */
    const steps = this.steps.toArray();
    this.process.controls.forEach(async (pC, i) => {
      const stepsBlocks = await steps[i].editor.save();
      pC.setValue(stepsBlocks.blocks);
    });

    const blocks =  await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.hiringprocessForm.removeControl('_id');
      const hiringprocessValue = { ...this.hiringprocessForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(hiringprocessValue);
      this.postService.addPost(hiringprocessValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    } else {
      const hiringprocessValue = { ...this.hiringprocessForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(hiringprocessValue);
      this.postService.updatePost(hiringprocessValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    }
  }

  onlySendIdForTags(hiringprocessValue) {
    hiringprocessValue.company = hiringprocessValue.company && hiringprocessValue.company._id ? hiringprocessValue.company._id : hiringprocessValue.company;
    hiringprocessValue.jobProfile = hiringprocessValue.jobProfile.map(c => c._id);
  }

  addStep(i: number) {
    this.process.insert(i + 1, new FormControl([]));
  }

  removeStep(i: number) {
    this.process.removeAt(i);
  }

}

