import { Component, OnInit, ViewChild, Inject, OnDestroy, Injector } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { City } from '../../shared/models/city.model';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { CompanyService } from '../../companies/company.service';
import { SetSelectedPost, GetPostById, AddPost, UpdatePost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, switchMap } from 'rxjs/operators';
import { Post } from '../../shared/models/post.model';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import { PostService } from '../../shared/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
  providers: [CompanyService]
})
export class AddJobComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  breadcumb: BreadCumb;
  jobForm: FormGroup;
  allCompanies = [];

  edit: boolean;

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

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  citySuggestions: City[];

  salaryRangeFrom = 30;
  salaryRangeTo = 50;

  public dialogRef = null;
  public data;

  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private formService: FormService,
    private companyService: CompanyService,
    private postService: PostService,
    private injector: Injector,
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);

    this.breadcumb = {
      title: 'Add Job Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Job'
        }
      ]
    };

    /** If it is "add-job" route intialize empty job form, but we are setting store property of "Selectedjob" as null
     * and if it is "edit-job route" we need to subscribe to get "Selectedjob" and user refresh the tab,
     * there won't be any selected job,
     * so we need to make the call to
     * get the job by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig && this.activatedRoute.snapshot.parent.routeConfig.path === 'add-job' || (this.data && this.data.referencePostId)) {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.jobFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.jobFormInitialization(h);
          this.edit = true;
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
    this.store.dispatch(SetSelectedPost({post: null}));
  }

  ngOnInit() {}

  jobFormInitialization(i: Post) {
    this.jobForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      jobProfile: new FormControl(i && i.jobProfile ? i.jobProfile : []),
      company: new FormControl(i && i.company ? i.company._id : '', Validators.required),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      cities: new FormControl(i && i.cities && i.cities.length ? i.cities : []),
      salaryCurrency: new FormControl(i && i.salaryCurrency ? i.salaryCurrency : '$'),
      salaryRangeFrom: new FormControl(i && i.salaryRangeFrom ? i.salaryRangeFrom : 10),
      salaryRangeTo: new FormControl(i && i.salaryRangeTo ? i.salaryRangeTo : 30),
      type: new FormControl(PostType.Job),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
    });

    if(this.data && this.data.referencePostId) {
      this.jobForm.addControl('referencePostId', new FormControl(this.data.referencePostId));
    }

    this.salaryRangeFrom = this.jobForm.get('salaryRangeFrom').value;
    this.salaryRangeTo = this.jobForm.get('salaryRangeTo').value;

    this.formService.findFromCollection('', 'cities').subscribe((cities) => {
      // const filteredCitys = _.differenceBy(cities, i.cities, '_id');
      this.citySuggestions = cities;
    });

    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;
    });

  }

  submit(status) {

    this.statusFormControl.setValue(status);

    this.jobForm.get('salaryRangeFrom').setValue(this.salaryRangeFrom);
    this.jobForm.get('salaryRangeTo').setValue(this.salaryRangeTo);

    if (!this.descriptionFormControl.value) {
      this.descriptionFormControl.setValue([]);
    }

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }
    

    if (this.idFromControl && !this.idFromControl.value) {
      this.jobForm.removeControl('_id');
      const jobValue = {...this.jobForm.value};
      jobValue.company = jobValue && jobValue.company ? jobValue.company._id : '';
      if (this.data && this.data.referencePostId) {
        this.postService.addPost(jobValue).subscribe((p) => {
          if (p) {
            Swal.fire(`${p.type} has been ${p.status} Successfully`, '', 'success');
            this.dialogRef.close(p);
            this.store.dispatch(SetSelectedPost({post: null}));
          }
        })
      } else {
        this.store.dispatch(AddPost({post: jobValue}));
      }
    } else {
      const jobValue = {...this.jobForm.value};
      this.store.dispatch(UpdatePost({post: jobValue}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.jobForm.get('description').setValue(event);
  }

  addTagFn(name) {
    return name;
  }

  addCitiesFn(name) {
    return {name};
  }

  addCompany = (name: string) => {
    if (name) {
      return new Promise((resolve, reject) => {
        this.companyService.addCompany({name, createdBy: this.authService.loggedInUser._id}).subscribe(c => {
          this.allCompanies.unshift(c);
          this.allCompanies = this.allCompanies.slice();
          return resolve(c.name);
        })
      })
    }
  }

}
