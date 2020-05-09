import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { catchError, } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { Tag } from '../../shared/models/product.model';
import { CompanyService } from '../company.service';
import { CompanyTypes, Company } from '../../shared/models/company.model';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { PostService } from '../../shared/services/post.service';
import { PostType } from '../../shared/models/post-types.enum';
import { EditorComponent } from '../../shared/components/editor/editor.component';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  providers: [CompanyService]
})
export class AddCompanyComponent implements OnInit {
  breadcumb: BreadCumb;
  companyForm: FormGroup;

  companyTypes = Object.values(CompanyTypes);

  postTypes = PostType;

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

  listOfCompanies: any[] = [];
  companiesPageNumber = 1;
  totalCompanies: number;

  subscription$: Subscription;

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  allCities: Tag[];

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    public formService: FormService,
    public companyService: CompanyService,
    public postService: PostService
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<AddCompanyComponent>
  ) {

    // console.log('dialogdata', this.data);
    const params: any = this.activatedRoute.snapshot.params;

    this.breadcumb = {
      title: 'Add Company',
      path: [
        {
          name: 'Add Company'
        }
      ]
    };

    if (params.companyId) {
      this.subscription$ = this.companyService.getCompanyById(params.companyId).subscribe((c) => {
        this.companyFormInitialization(c);
      });
    } else {
      this.companyFormInitialization(null);
    }

    // this.companyFormInitialization();
  }

  ngOnInit() {
    this.fetchCompanies(1);
  }

  async companyFormInitialization(i: Company) {
    this.companyForm = await new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      type: new FormControl(i && i.type ? i.type : ''),
      cities: new FormControl(i && i.cities && i.cities.length ? i.cities : []),
      // description: new FormControl(i && i.description ? i.description : ''),
      // ideas: new FormControl(i && i.ideas ? i.ideas : ''),
      // questions: new FormControl(i && i.questions ? i.questions : ''),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      owners: new FormControl(i && i.owners ? i.owners : []),
      status: new FormControl(i && i.status ? i.status : 'Created'),
      _id: new FormControl(i && i._id ? i._id : ''),
      location: new FormGroup({
        address: new FormControl(i && i.location ? i.location.address : ''),
      }),
    });

    this.formService.findFromCollection('', 'cities').subscribe((cities) => {
      this.allCities = cities;
    });

  }

  async submit(status) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }
    // this.statusFormControl.setValue(status);

    // const blocks =  await this.descriptionEditor.editor.save();
    // this.descriptionFormControl.setValue(blocks.blocks);

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
        if (d) {
          Swal.fire(`${d.name} has been Created Successfully`, '', 'success').then(() => {
            this.companyService.redirectToCompanyDetails(d._id);
          });
          this.companyFormInitialization(d);
        }
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

  fetchCompanies(pageNumber) {
    this.companyService.getCompaniesByType('', {pageNumber, limit: 3}).subscribe((dj: any) => {
      if (dj && dj.companies) {
        this.listOfCompanies = this.listOfCompanies.concat(dj.companies);
        this.totalCompanies = dj.total;
      }
    });
  }
}

