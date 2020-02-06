import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Subscription, of, Observable, Subject, concat } from 'rxjs';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { SetSelectedPost, GetPostById } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import { AppState } from '../../core/store/state/app.state';
import { Post } from '../../shared/models/post.model';
import { CompanyService } from '../../companies/company.service';
import { PostService } from '../../shared/services/post.service';
import { EditorComponent } from '../../shared/components/editor/editor.component';

@Component({
  selector: 'app-add-hiring-process',
  templateUrl: './add-hiring-process.component.html',
  styleUrls: ['./add-hiring-process.component.scss'],
  providers: [CompanyService]
})

export class AddHiringProcessComponent implements OnInit {

  breadcumb: BreadCumb;
  hiringprocessForm: FormGroup;

  allCompanies = [];

  edit: boolean;

  roles$: Observable<any[]>;
  rolesLoading = false;
  roleInput$ = new Subject<string>();

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
    public formService: FormService,
    private companyService: CompanyService,
    public postService: PostService
  ) {
    this.breadcumb = {
      title: 'Add Hiring Process',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Hiring Process'
        }
      ]
    };

    /** If it is "add-hiringprocess" route intialize empty hiringprocess form, but we are setting store property of "Selectedhiringprocess" as null
     * and if it is "edit-hiringprocess route" we need to subscribe to get "Selectedhiringprocess" and user refresh the tab,
     * there won't be any selected hiringprocess,
     * so we need to make the call to
     * get the hiringprocess by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig.path === 'add-hiring-process') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.hiringprocessFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.hiringprocessFormInitialization(h);
          this.edit = true;
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
      company: new FormControl(i && i.company ? i.company._id : []),
      hiringProcess: new FormArray(i && i.hiringProcess ? this.setProcessFormControl(i.hiringProcess) : [new FormControl([])]),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      type: new FormControl(PostType.HiringProcess),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
    });


    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;
    });

    this.roles$ = concat(
      of([]), // default items
      this.roleInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.rolesLoading = true),
        switchMap(term => this.formService.findFromCollection(term, 'tags', 'role').pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.rolesLoading = false)
        ))
      )
    );
  }

  async submit(status) {

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
    hiringprocessValue.jobProfile = hiringprocessValue.jobProfile.map(c => c._id);
  }


  addCompany = (name: string) => {
    if (name) {
      return new Promise((resolve, reject) => {
        this.companyService.addCompany({ name, createdBy: this.authService.loggedInUser._id }).subscribe(c => {
          this.allCompanies.unshift(c);
          this.allCompanies = this.allCompanies.slice();
          return resolve(c.name);
        });
      });
    }
  }

  addStep(i: number) {
    this.process.insert(i + 1, new FormControl([]));
  }

  removeStep(i: number) {
    this.process.removeAt(i);
  }

}

