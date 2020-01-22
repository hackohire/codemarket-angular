import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, of } from 'rxjs';
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
import { tap, switchMap } from 'rxjs/operators';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import { AppState } from '../../core/store/state/app.state';
import { Post } from '../../shared/models/post.model';
// import { Options } from 'ng5-slider/options';
import { CompanyService } from '../../companies/company.service';
import { PostService } from '../../shared/services/post.service';
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
  // options: Options = {
  //   floor: 0,
  //   ceil: 300,
  //   step: 10,
  //   // showTicks: true,
  //   // draggableRange: true,
  //   // translate: (value: number): string => {
  //   //   return '$' + value + ' k';
  //   // }
  // };

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

  subscription$: Subscription;

  citySuggestions: City[];

  salaryRangeFrom = 30;
  salaryRangeTo = 50;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public formService: FormService,
    private companyService: CompanyService,
    private postService: PostService
  ) {
    this.breadcumb = {
      title: 'Add Your Career Goal or Your Dream job Details',
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

  ngOnInit() { }

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

    // this.salaryRangeFrom = this.dreamjobForm.get('salaryRangeFrom').value;
    // this.salaryRangeTo = this.dreamjobForm.get('salaryRangeTo').value;

    this.formService.findFromCollection('', 'cities').subscribe((cities) => {
      this.citySuggestions = cities;
    });

    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;
    });

  }

  submit(status) {

    this.statusFormControl.setValue(status);

    this.dreamjobForm.get('salaryRangeFrom').setValue(this.salaryRangeFrom);
    this.dreamjobForm.get('salaryRangeTo').setValue(this.salaryRangeTo);

    if (!this.descriptionFormControl.value) {
      this.descriptionFormControl.setValue([]);
    }

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.dreamjobForm.removeControl('_id');
      const dreamJobValue = { ...this.dreamjobForm.value };

      /** Only Send _id */
      dreamJobValue.companies = dreamJobValue.companies.map(c => c._id);
      this.postService.addPost(dreamJobValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToDreamJobDetails(j);
        }
      })
    } else {
      const dreamJobValue = { ...this.dreamjobForm.value };

      /** Only Send _id */
      dreamJobValue.companies = dreamJobValue.companies.map(c => c._id);
      this.postService.updatePost(dreamJobValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToDreamJobDetails(j);
        }
      })
    }
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

  addCompany = (name: string) => {
    if (name) {
      return new Promise((resolve, reject) => {
        // const dialogRef = this.dialog.open(AddCompanyComponent, {
        //   width: '630px',
        //   height: '550px',
        //   maxHeight: '700px',
        //   panelClass: 'no-padding',
        //   data: {name},
        //   // disableClose: true
        // });

        this.companyService.addCompany({name, createdBy: this.authService.loggedInUser._id}).subscribe(c => {
          this.allCompanies.unshift(c);
          this.allCompanies = this.allCompanies.slice();
          return resolve(c.name);
        })
  
        // dialogRef.afterClosed().subscribe(result => {
        //   if(result) {
        //     this.allCompanies.unshift(result);
        //     this.allCompanies = this.allCompanies.slice();
        //     return resolve(result.name);
        //   }
        //   console.log('The dialog was closed');
        // });
      })
    }
  }


}
