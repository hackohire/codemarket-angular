import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, of, Observable, Subject, concat } from 'rxjs';
import { City } from '../../shared/models/city.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
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
// import { Options } from 'ng5-slider/options';
import { CompanyService } from '../../companies/company.service';
import { PostService } from '../../shared/services/post.service';
import { environment } from '../../../environments/environment';
import { EditorComponent } from '../../shared/components/editor/editor.component';
// import { AddCompanyComponent } from '../../companies/add-company/add-company.component';

@Component({
  selector: 'app-add-dreamjob',
  templateUrl: './add-dreamjob.component.html',
  styleUrls: ['./add-dreamjob.component.scss'],
  providers: [CompanyService]
})
export class AddDreamjobComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  breadcumb: BreadCumb;
  dreamjobForm: FormGroup;

  allCompanies = [];

  edit: boolean;

  get createdBy() {
    return this.dreamjobForm.get('createdBy');
  }

  get idFromControl() {
    return this.dreamjobForm.get('_id');
  }

  get descriptionFormControl() {
    return this.dreamjobForm.get('description');
  }

  get citiesFormControl() {
    return this.dreamjobForm.get('cities') as FormArray;
  }

  get statusFormControl() {
    return this.dreamjobForm.get('status');
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  listOfDreamJobs: any[] = [];
  dreamJobPageNumber = 1;
  totalDreamJobs: number;

  listOfJobs: any[] = [];
  jobPageNumber = 1;
  totalJobs: number;

  subscription$: Subscription;

  citySuggestions$: Observable<City[]>;
  cityInput$ = new Subject<string>();
  citiesLoading = false;

  roles$: Observable<any[]>;
  rolesLoading = false;
  roleInput$ = new Subject<string>();

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('descriptionEditor', { static: true }) descriptionEditor: EditorComponent;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public formService: FormService,
    private companyService: CompanyService,
    public postService: PostService
  ) {
    this.breadcumb = {
      title: 'Add Your Career Goal or Your Dream Job Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Dream job'
        }
      ]
    };

    /** If it is "add-dreamjob" route intialize empty dreamjob form, but we are setting store property of "Selecteddreamjob" as null
     * and if it is "edit-dreamjob route" we need to subscribe to get "Selecteddreamjob" and user refresh the tab,
     * there won't be any selected dreamjob,
     * so we need to make the call to
     * get the dreamjob by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig.path === 'add-dreamjob') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.dreamjobFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.dreamjobFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Post) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ dreamjobId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected dreamjob, so we need to make the call to
           * get the dreamjob by fetching id from the params
           */
          if (params.dreamjobId) {
            this.store.dispatch(GetPostById({ postId: params.dreamjobId }));
          }
        })
      ).subscribe();
    }

    // this.dreamjobFormInitialization();
  }

  ngOnInit() {
    this.fetchDreamJobs(1);
    this.fetchJobs(1);
  }

  dreamjobFormInitialization(i: Post) {
    console.log(i && i.companies ? i.companies : []);
    this.dreamjobForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      jobProfile: new FormControl(i && i.jobProfile ? i.jobProfile : []),
      // company: new FormControl(i && i.company ? i.company._id : ''),
      companies: new FormControl(i && i.companies ? i.companies : []),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      cities: new FormControl(i && i.cities && i.cities.length ? i.cities : []),
      salaryCurrency: new FormControl(i && i.salaryCurrency ? i.salaryCurrency : '$'),
      salaryRangeFrom: new FormControl(i && i.salaryRangeFrom ? i.salaryRangeFrom : 10),
      salaryRangeTo: new FormControl(i && i.salaryRangeTo ? i.salaryRangeTo : 30),
      type: new FormControl(PostType.Dreamjob),
      timeline: new FormControl(i && i.timeline ? i.timeline : 0),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
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

    this.citySuggestions$ = concat(
      of([]), // default items
      this.cityInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.citiesLoading = true),
        switchMap(term => this.formService.findFromCollection(term, 'cities').pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.citiesLoading = false)
          ))
        )
    );

    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;
    });

  }

  async submit(status) {

    this.statusFormControl.setValue(status);


    const blocks =  await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.dreamjobForm.removeControl('_id');
      const dreamJobValue = { ...this.dreamjobForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(dreamJobValue);
      this.postService.addPost(dreamJobValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToDreamJobDetails(j);
        }
      });
    } else {
      const dreamJobValue = { ...this.dreamjobForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(dreamJobValue);
      this.postService.updatePost(dreamJobValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToDreamJobDetails(j);
        }
      });
    }
  }

  onlySendIdForTags(dreamJobValue) {
    dreamJobValue.companies = dreamJobValue.companies.map(c => c._id);
    dreamJobValue.cities = dreamJobValue.cities.map(c => c._id);
    dreamJobValue.jobProfile = dreamJobValue.jobProfile.map(c => c._id);
  }

  updateFormData(event) {
    console.log(event);
    this.dreamjobForm.get('description').setValue(event);
  }

  addTagFn(name) {
    return name;
  }

  addCitiesFn(name) {
    return { name };
  }

  fetchDreamJobs(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 3}, 'dream-job').subscribe((dj) => {
      if (dj && dj.posts) {
        this.listOfDreamJobs = this.listOfDreamJobs.concat(dj.posts);
        this.totalDreamJobs = dj.total;
      }
    });
  }

  fetchJobs(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 3}, 'job').subscribe((dj) => {
      if (dj && dj.posts) {
        this.listOfJobs = this.listOfJobs.concat(dj.posts);
        this.totalJobs = dj.total;
      }
    });
  }

  addCompany = (name: string) => {
    if (name) {
      return new Promise((resolve, reject) => {
        this.companyService.addCompany({name, createdBy: this.authService.loggedInUser._id}).subscribe(c => {
          this.allCompanies.unshift(c);
          this.allCompanies = this.allCompanies.slice();
          return resolve(c.name);
        });
      });
    }
  }


}
