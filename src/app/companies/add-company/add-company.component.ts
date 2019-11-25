import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { startWith, map, catchError } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { Tag } from '../../shared/models/product.model';
import { CompanyService } from '../company.service';
import { CompanyTypes, Company } from '../../shared/models/company.model';
import { startCase } from 'lodash';
import Swal from 'sweetalert2';
import { LocationService } from '../../shared/services/location.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
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

  // get statusFormControl() {
  //   return this.companyForm.get('status');
  // }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  searchText = new FormControl();
  citySuggestions: Tag[];
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
    private formService: FormService,
    private companyService: CompanyService,
    public locationService: LocationService
  ) {
    const queryParams: any = this.activatedRoute.snapshot.queryParams;
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

    this.companyFormInitialization(null);
    if (this.activatedRoute.snapshot.routeConfig.path === 'add-company') {
      // this.companyFormInitialization(null);
    } else {
      if (params.companyId) {
        this.subscription$ = this.companyService.getCompanyById(params.companyId).subscribe((c) => {
          this.edit = true;
          this.companyFormInitialization(c);
        });
      }

    }

    // this.companyFormInitialization();
  }

  ngOnInit() {
  }

  async companyFormInitialization(i: Company) {
    this.companyForm = await new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      type: new FormControl(i && i.type ? i.type : ''),
      cities: this.fb.array(i && i.cities && i.cities.length ? i.cities : []),
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

    await this.locationService.setLocaionSearhAutoComplete(this.searchLocation, this.locationFormGroup);

    this.formService.findFromCollection('', 'cities').subscribe((cities) => {
      this.citySuggestions = cities;
      this.allCities = cities;
    });

    this.searchText.valueChanges.pipe(
      startWith(''),
      map((text) => text ? this._filter(text) : this.allCities && this.allCities.length ? this.allCities.slice() : []))
      .subscribe((cities) => this.citySuggestions = cities);

  }

  private _filter(value): Tag[] {
    const filterValue = value && value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allCities.filter(city => city.name.toLowerCase().indexOf(filterValue) === 0);
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
  
  addTech(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const availableTag = this.citySuggestions.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      const formAvailableInTafsFormControl = this.citiesFormControl.value.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      if (formAvailableInTafsFormControl) {
        event.input.value = '';
      } else if (availableTag) {
        this.citiesFormControl.push(new FormControl({ name: availableTag.name, _id: availableTag._id }));
      } else {
        this.formService.addCategory(this.citiesFormControl, event);
      }
      // this.tagSuggestions = this.tagSuggestions.filter((t) => t.name.toLowerCase() !== event.value.trim().toLowerCase())
      this.searchText.setValue(null);
    }
  }

  selected(event) {
    // this.tagSuggestions = this.tagSuggestions.filter((t) => t._id !== event.option.value._id)
    const formAvailableInTafsFormControl = this.citiesFormControl.value.find((t) => t.name.toLowerCase() == event.option.value.name.trim().toLowerCase());
    if (formAvailableInTafsFormControl) {
      event.input.value = '';
    } else {
      this.formService.selectedCategory(this.citiesFormControl, event);
    }
    this.searchInput.nativeElement.value = null;
    this.searchText.setValue(null);
  }


  // Remove a Tag
  public remove(index: number): void {
    this.formService.removeCategory(this.citiesFormControl, index);
  }
}

