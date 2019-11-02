import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { City } from '../../shared/models/city.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { SetSelectedPost, GetPostById, AddPost, UpdatePost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, switchMap, startWith, map } from 'rxjs/operators';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import { AppState } from '../../core/store/state/app.state';
import { Post } from '../../shared/models/post.model';
import { Options } from 'ng5-slider/options';
import { CompanyService } from '../../companies/company.service';

@Component({
  selector: 'app-add-dreamjob',
  templateUrl: './add-dreamjob.component.html',
  styleUrls: ['./add-dreamjob.component.scss']
})
export class AddDreamjobComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  breadcumb: BreadCumb;
  dreamjobForm: FormGroup;
  options: Options = {
    floor: 0,
    ceil: 300,
    step: 10,
    // showTicks: true,
    draggableRange: true,
    translate: (value: number): string => {
      return '$' + value + ' k';
    }
  };

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

  searchText = new FormControl();
  citySuggestions: City[];
  allCities: City[];
  salaryRangeFrom = 30;
  salaryRangeTo = 50;

  @ViewChild('searchInput', {static: false}) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private formService: FormService,
    private companyService: CompanyService
  ) {
    this.breadcumb = {
      title: 'Add Dream job Details',
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

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-dreamjob') {
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

  ngOnInit() {}

  dreamjobFormInitialization(i: Post) {
    this.dreamjobForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      jobProfile: new FormControl(i && i.jobProfile ? i.jobProfile : ''),
      company: new FormControl(i && i.company ? i.company._id : '', Validators.required),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      cities: this.fb.array(i && i.cities && i.cities.length ? i.cities : []),
      salaryRangeFrom: new FormControl(i && i.salaryRangeFrom ? i.salaryRangeFrom : 10),
      salaryRangeTo: new FormControl(i && i.salaryRangeTo ? i.salaryRangeTo : 30),
      type: new FormControl(PostType.Dreamjob),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
    });

    this.salaryRangeFrom = this.dreamjobForm.get('salaryRangeFrom').value;
    this.salaryRangeTo = this.dreamjobForm.get('salaryRangeTo').value;

    this.formService.findFromCollection('', 'cities').subscribe((cities) => {
      // const filteredCitys = _.differenceBy(cities, i.cities, '_id');
      this.citySuggestions = cities;
      this.allCities = cities;
    });

    this.companyService.getAllCompanies().subscribe((companies) => {
      this.allCompanies = companies;
    });

    this.searchText.valueChanges.pipe(
      startWith(''),
      map((text) => text ? this._filter(text) : this.allCities && this.allCities.length ? this.allCities.slice() : []))
      .subscribe((cities) => this.citySuggestions = cities);

  }

  private _filter(value): City[] {
    const filterValue = value && value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allCities.filter(city => city.name.toLowerCase().indexOf(filterValue) === 0);
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
      this.store.dispatch(AddPost({post: this.dreamjobForm.value}));
    } else {
      this.store.dispatch(UpdatePost({post: this.dreamjobForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.dreamjobForm.get('description').setValue(event);
  }

  addTech(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const availableCity = this.citySuggestions.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      const formAvailableInTafsFormControl = this.citiesFormControl.value.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      if (formAvailableInTafsFormControl && event && event.input && event.input.value) {
        event.input.value = '';
      } else if (availableCity) {
        this.citiesFormControl.push(new FormControl({name: availableCity.name, _id: availableCity._id}));
      } else {
        this.formService.addCategory(this.citiesFormControl, event);
      }
      this.searchText.setValue(null);
    }
  }

  selected(event) {
    const formAvailableInTafsFormControl = this.citiesFormControl.value.find((t) => t.name.toLowerCase() == event.option.value.name.trim().toLowerCase());
    if (formAvailableInTafsFormControl) {
      event.option.value = '';
    } else {
      this.formService.selectedCategory(this.citiesFormControl, event);
    }
    this.searchInput.nativeElement.value = null;
    this.searchText.setValue(null);
  }


  // Remove a City
  public remove(index: number): void {
    this.formService.removeCategory(this.citiesFormControl, index);
  }

}
