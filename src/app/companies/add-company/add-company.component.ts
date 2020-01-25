import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { catchError, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Subscription, of, Observable, Subject, concat } from 'rxjs';
import { Tag } from '../../shared/models/product.model';
import { CompanyService } from '../company.service';
import { CompanyTypes, Company } from '../../shared/models/company.model';
import Swal from 'sweetalert2';
import { LocationService } from '../../shared/services/location.service';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  providers: [CompanyService]
})
export class AddCompanyComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  breadcumb: BreadCumb;
  companyForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  companyTypes = Object.values(CompanyTypes);

  edit: boolean;

  get createdBy() {
    return this.companyForm.get('createdBy');
  }

  get idFromControl() {
    return this.companyForm.get('_id');
  }

  get descriptionFormControl() {
    return this.companyForm.get('description');
  }

  get ideasFormControl() {
    return this.companyForm.get('ideas');
  }

  get questionsFormControl() {
    return this.companyForm.get('questions');
  }

  get citiesFormControl() {
    return this.companyForm.get('cities') as FormArray;
  }

  get locationFormGroup() {
    return this.companyForm.get('location');
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  citySuggestions$: Observable<City[]>;
  cityInput$ = new Subject<string>();
  citiesLoading = false;

  subscription$: Subscription;

  allCities: Tag[];

  /** Location Variables */
  zoom: number = 15;
  @ViewChild('searchLocation', { static: true }) public searchLocation: ElementRef;

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public formService: FormService,
    private companyService: CompanyService,
    public locationService: LocationService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<AddCompanyComponent>
  ) {

    // console.log('dialogdata', this.data);
    const params: any = this.activatedRoute.snapshot.params;

    this.breadcumb = {
      title: 'Add Company',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Company'
        }
      ]
    };

    /** If it is "add-company" route intialize empty company form, but we are setting store property of "Selectedcompany" as null
     * and if it is "edit-company route" we need to subscribe to get "Selectedcompany" and user refresh the tab,
     * there won't be any selected company,
     * so we need to make the call to
     * get the company by fetching id from the params
     */

    // this.companyFormInitialization(null);
    if (params.companyId) {
      this.subscription$ = this.companyService.getCompanyById(params.companyId).subscribe((c) => {
        this.edit = true;
        this.companyFormInitialization(c);
      });
    } else {
      this.companyFormInitialization(null);
    }

    // this.companyFormInitialization();
  }

  ngOnInit() {
  }

  async companyFormInitialization(i: Company) {
    this.companyForm = await new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      type: new FormControl(i && i.type ? i.type : ''),
      cities: new FormControl(i && i.cities && i.cities.length ? i.cities : []),
      description: new FormControl(i && i.description ? i.description : ''),
      // ideas: new FormControl(i && i.ideas ? i.ideas : ''),
      // questions: new FormControl(i && i.questions ? i.questions : ''),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      status: new FormControl(i && i.status ? i.status : 'Created'),
      _id: new FormControl(i && i._id ? i._id : ''),
      location: new FormGroup({
        latitude: new FormControl(i && i.location ? i.location.latitude : 0),
        longitude: new FormControl(i && i.location ? i.location.longitude : 0),
        address: new FormControl(i && i.location ? i.location.address : ''),
      }),
    });

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

    await this.locationService.setLocaionSearhAutoComplete(this.searchLocation, this.locationFormGroup);

    this.formService.findFromCollection('', 'cities').subscribe((cities) => {
      this.allCities = cities;
    });

  }

  submit(status) {

    // this.statusFormControl.setValue(status);

    if (!this.descriptionFormControl.value) {
      this.descriptionFormControl.setValue([]);
    }

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.companyForm.removeControl('_id');

      this.companyService.addCompany(this.companyForm.value).pipe(
        catchError((e) => {
          Swal.fire('Name already exists!', '', 'error');
          return of(false);
        })
      ).subscribe((d: any) => {
        Swal.fire(`${d.name} has been Created Successfully`, '', 'success').then(() => {
          this.companyService.redirectToCompanyDetails(d._id);
        });
        this.companyFormInitialization(d);
      });

    } else {
      this.companyService.updateCompany(this.companyForm.value).pipe(
        catchError((e) => {
          Swal.fire('Name already exists!', '', 'error');
          return of(false);
        })
      )
        .subscribe((d: any) => {
          if (d) {
            Swal.fire(`${d.name} has been Updated Successfully`, '', 'success').then(() => {
              this.companyService.redirectToCompanyDetails(d._id);
            });
            this.companyFormInitialization(d);
          }
        });
    }
  }

  addCitiesFn(name) {
    return { name };
  }
}

