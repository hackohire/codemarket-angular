import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, of, Observable, Subject, concat } from 'rxjs';
import { City } from '../../shared/models/city.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { appConstants } from '../../shared/constants/app_constants';
import { environment } from '../../../environments/environment';
import { EditorComponent } from '../../shared/components/editor/editor.component';

// import { AddCompanyComponent } from '../../companies/add-company/add-company.component';


@Component({
  selector: 'app-add-career-coach',
  templateUrl: './add-career-coach.component.html',
  styleUrls: ['./add-career-coach.component.scss'],
  providers: [CompanyService]
})

export class AddCareerCoachComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  breadcumb: BreadCumb;
  careerCoachForm: FormGroup;
  allCompanies = [];
  edit: boolean;
  careerCoachQuestions = appConstants.careerCoachQuestions;

  get createdBy() {
    return this.careerCoachForm.get('createdBy');
  }

  get idFromControl() {
    return this.careerCoachForm.get('_id');
  }

  get descriptionFormControl() {
    return this.careerCoachForm.get('description');
  }

  get statusFormControl() {
    return this.careerCoachForm.get('status');
  }

  listOfCareerCoaches: any[] = [];
  careerCoachPageNumber = 1;
  totalCareerCoaches: number;

  listOfDreamJobs: any[] = [];
  dreamJobPageNumber = 1;
  totalDreamJobs: number;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  citySuggestions: City[];

  roles$: Observable<any[]>;
  rolesLoading = false;
  roleInput$ = new Subject<string>();

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

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
      title: 'Add Career Coach',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Career Coach'
        }
      ]
    };

    /** If it is "add-careercoach" route intialize empty careercoach form, but we are setting store property of "SelectedcareerCoach" as null
     * and if it is "edit-careercoach route" we need to subscribe to get "SelectedcareerCoach" and user refresh the tab,
     * there won't be any selected careercoach,
     * so we need to make the call to
     * get the careercoach by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig.path === 'add-careercoach') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.careerCoachFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.careerCoachFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Post) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ careerCoachId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected careercoach, so we need to make the call to
           * get the careercoach by fetching id from the params
           */
          if (params.careerCoachId) {
            this.store.dispatch(GetPostById({ postId: params.careerCoachId }));
          }
        })
      ).subscribe();
    }

  }

  ngOnInit() {
    this.fetchCareerCoaches(1);
    this.fetchDreamJobs(1);
  }

  careerCoachFormInitialization(i: Post) {
    console.log(i && i.companies ? i.companies : []);
    this.careerCoachForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : []),
      jobProfile: new FormControl(i && i.jobProfile ? i.jobProfile : []),
      companies: new FormControl(i && i.companies ? i.companies : []),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      gapAnalysis: new FormControl(i && i.gapAnalysis ? i.gapAnalysis : false),
      careerCoachSessions: new FormControl(i && i.careerCoachSessions ? i.careerCoachSessions : false),
      helpingWithMockInterviews: new FormControl(i && i.helpingWithMockInterviews ? i.helpingWithMockInterviews : false),
      hiringMentoringSessions: new FormControl(i && i.hiringMentoringSessions ? i.hiringMentoringSessions : false),
      type: new FormControl(PostType.CareerCoach),
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

    const blocks =  await this.descriptionEditor.editor.save();
    this.careerCoachForm.get('description').setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.careerCoachForm.removeControl('_id');
      const careerCoachValue = { ...this.careerCoachForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(careerCoachValue);
      this.postService.addPost(careerCoachValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    } else {
      const careerCoachValue = { ...this.careerCoachForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(careerCoachValue);
      this.postService.updatePost(careerCoachValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    }
  }

  onlySendIdForTags(careercoach) {
    careercoach.jobProfile = careercoach.jobProfile.map(c => c._id);
    careercoach.companies = careercoach.companies.map(c => c._id);
  }

  fetchCareerCoaches(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 3}, 'career-coach').subscribe((cc) => {
      if (cc && cc.posts) {
        this.listOfCareerCoaches = this.listOfCareerCoaches.concat(cc.posts);
        this.totalCareerCoaches = cc.total;
      }
    });
  }

  fetchDreamJobs(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 3}, 'dream-job').subscribe((dj) => {
      if (dj && dj.posts) {
        this.listOfDreamJobs = this.listOfDreamJobs.concat(dj.posts);
        this.totalDreamJobs = dj.total;
      }
    });
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
        this.companyService.addCompany({name, createdBy: this.authService.loggedInUser._id}).subscribe(c => {
          this.allCompanies.unshift(c);
          this.allCompanies = this.allCompanies.slice();
          return resolve(c.name);
        });
      });
    }
  }


}

