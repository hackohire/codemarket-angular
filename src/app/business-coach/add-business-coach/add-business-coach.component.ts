import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, of, Subject, Observable, concat } from 'rxjs';
import { City } from '../../shared/models/city.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { SetSelectedPost, GetPostById } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, switchMap, distinctUntilChanged, catchError, finalize } from 'rxjs/operators';
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
  selector: 'app-add-business-coach',
  templateUrl: './add-business-coach.component.html',
  styleUrls: ['./add-business-coach.component.scss'],
  providers: [CompanyService]
})

export class AddBusinessCoachComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  breadcumb: BreadCumb;
  businessCoachForm: FormGroup;
  allCompanies = [];
  edit: boolean;
  businessCoachQuestions = appConstants.businessCoachQuestions;

  get createdBy() {
    return this.businessCoachForm.get('createdBy');
  }

  get idFromControl() {
    return this.businessCoachForm.get('_id');
  }

  get descriptionFormControl() {
    return this.businessCoachForm.get('description');
  }

  get citiesFormControl() {
    return this.businessCoachForm.get('cities') as FormArray;
  }

  get statusFormControl() {
    return this.businessCoachForm.get('status');
  }

  listOfBusinessCoaches: any[] = [];
  businessCoachPageNumber = 1;
  totalBusinessCoaches: number;

  listOfBusinessGoals: any[] = [];
  businessGoalsPageNumber = 1;
  totalBusinessGoals: number;


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  citySuggestions$: Observable<City[]>;
  cityInput$ = new Subject<string>();
  citiesLoading = false;

  roles$: Observable<any[]>;
  rolesLoading = false;
  roleInput$ = new Subject<string>();

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  businessAreas$: Observable<any[]>;
  businessAreasLoading = false;
  businessAreasInput$ = new Subject<string>();

  businessChallenges$: Observable<any[]>;
  businessChallengesLoading = false;
  businessChallengesInput$ = new Subject<string>();

  businessGoals$: Observable<any[]>;
  businessGoalsLoading = false;
  businessGoalsInput$ = new Subject<string>();

  products$: Observable<any[]>;
  productsLoading = false;
  productsInput$ = new Subject<string>();

  services$: Observable<any[]>;
  servicesLoading = false;
  servicesInput$ = new Subject<string>();

  @ViewChild('businessCoachEditor', { static: true }) businessCoachEditor: EditorComponent;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public formService: FormService,
    public companyService: CompanyService,
    private postService: PostService
  ) {
    this.breadcumb = {
      title: 'Add Business Coach',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Business Coach'
        }
      ]
    };

    /** If it is "add-businesscoach" route intialize empty businesscoach form, but we are setting store property of "SelectedbusinessCoach" as null
     * and if it is "edit-businesscoach route" we need to subscribe to get "SelectedbusinessCoach" and user refresh the tab,
     * there won't be any selected businesscoach,
     * so we need to make the call to
     * get the businesscoach by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig.path === 'add-businesscoach') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.businessCoachFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.businessCoachFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Post) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ businessCoachId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected businesscoach, so we need to make the call to
           * get the businesscoach by fetching id from the params
           */
          if (params.businessCoachId) {
            this.store.dispatch(GetPostById({ postId: params.businessCoachId }));
          }
        })
      ).subscribe();
    }

    // this.businessCoachFormInitialization();
  }

  ngOnInit() {
    this.fetchBusinessCoaches(1);
    this.fetchBusinessGoals(1);
  }

  businessCoachFormInitialization(i: Post) {
    console.log(i && i.companies ? i.companies : []);
    this.businessCoachForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : []),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      type: new FormControl(PostType.BusinessCoach),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),

      cities: new FormControl(i && i.cities && i.cities.length ? i.cities : []),
      jobProfile: new FormControl(i && i.jobProfile ? i.jobProfile : []),
      companies: new FormControl(i && i.companies ? i.companies : []),
      businessAreas: new FormControl(i && i.businessAreas ? i.businessAreas : []),
      businessGoals: new FormControl(i && i.businessGoals ? i.businessGoals : []),
      businessChallenges: new FormControl(i && i.businessChallenges ? i.businessChallenges : []),

      businessCoachSessions: new FormControl(i && i.businessCoachSessions ? i.businessCoachSessions : false),
      sellProducts: new FormGroup({
        sellProducts: new FormControl(i && i.sellProducts && i.sellProducts.sellProducts ? i.sellProducts.sellProducts : false),
        products: new FormControl(i && i.sellProducts && i.sellProducts.sellProducts ? i.sellProducts.products : [])
      }),
      sellServices: new FormGroup({
        sellServices: new FormControl(i && i.sellServices && i.sellServices.sellServices ? i.sellServices.sellServices : false),
        services: new FormControl(i && i.sellServices && i.sellServices.sellServices ? i.sellServices.services : [])
      }),
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

    this.businessAreas$ = concat(
      of([]), // default items
      this.businessAreasInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.businessAreasLoading = true),
        switchMap(term => this.formService.findFromCollection(term, 'tags').pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.businessAreasLoading = false)
          ))
        )
    );

    this.businessGoals$ = concat(
      of([]), // default items
      this.businessGoalsInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.businessGoalsLoading = true),
        switchMap(term => this.formService.findFromCollection(term, 'tags').pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.businessGoalsLoading = false)
          ))
        )
    );


    this.businessChallenges$ = concat(
      of([]), // default items
      this.businessChallengesInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.businessChallengesLoading = true),
        switchMap(term => this.formService.findFromCollection(term, 'tags').pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.businessChallengesLoading = false)
          ))
        )
    );

    this.products$ = concat(
      of([]), // default items
      this.productsInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.productsLoading = true),
        switchMap(term => this.formService.findFromCollection(term, 'tags').pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.productsLoading = false)
          ))
        )
    );

    this.services$ = concat(
      of([]), // default items
      this.servicesInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.servicesLoading = true),
        switchMap(term => this.formService.findFromCollection(term, 'tags').pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.servicesLoading = false)
          ))
        )
    );


    // this.citySuggestions$ = this.formService.searchTag(this.cityInput$, 'cities');


    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;
    });

  }

  async submit(status) {

    const blocks =  await this.businessCoachEditor.editor.save();
    this.businessCoachForm.get('description').setValue(blocks.blocks);

    this.statusFormControl.setValue(status);

    if (!this.descriptionFormControl.value) {
      this.descriptionFormControl.setValue([]);
    }

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.businessCoachForm.removeControl('_id');
      const businessCoachValue = { ...this.businessCoachForm.value };


      /** Only Send _id */
      this.onlySendIdForTags(businessCoachValue);
      this.postService.addPost(businessCoachValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    } else {
      const businessCoachValue = { ...this.businessCoachForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(businessCoachValue);
      this.postService.updatePost(businessCoachValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    }
  }

  onlySendIdForTags(businessCoachValue) {
    businessCoachValue.cities = businessCoachValue.cities.map(c => c._id);
    businessCoachValue.jobProfile = businessCoachValue.jobProfile.map(c => c._id);
    businessCoachValue.businessAreas = businessCoachValue.businessAreas.map(c => c._id);
    businessCoachValue.businessGoals = businessCoachValue.businessGoals.map(c => c._id);
    businessCoachValue.businessChallenges = businessCoachValue.businessChallenges.map(c => c._id);
    businessCoachValue.sellProducts.products = businessCoachValue.sellProducts.products.map(c => c._id);
    businessCoachValue.sellServices.services = businessCoachValue.sellServices.services.map(c => c._id);
    businessCoachValue.companies = businessCoachValue.companies.map(c => c._id);
  }

  fetchBusinessCoaches(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 3}, 'business-coach').subscribe((cc) => {
      if (cc && cc.posts) {
        this.listOfBusinessCoaches = this.listOfBusinessCoaches.concat(cc.posts);
        this.totalBusinessCoaches = cc.total;
      }
    });
  }

  fetchBusinessGoals(pageNumber) {
    this.postService.getAllPosts({pageNumber, limit: 3}, 'business-goal').subscribe((cc) => {
      if (cc && cc.posts) {
        this.listOfBusinessGoals = this.listOfBusinessGoals.concat(cc.posts);
        this.totalBusinessGoals = cc.total;
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
        this.companyService.addCompany({ name, createdBy: this.authService.loggedInUser._id }).subscribe(c => {
          this.allCompanies.unshift(c);
          this.allCompanies = this.allCompanies.slice();
          return resolve(c.name);
        });
      });
    }
  }


}


