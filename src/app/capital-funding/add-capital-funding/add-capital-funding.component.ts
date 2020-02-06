import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
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
  selector: 'app-add-capital-funding',
  templateUrl: './add-capital-funding.component.html',
  styleUrls: ['./add-capital-funding.component.scss'],
  providers: [CompanyService]
})
export class AddCapitalFundingComponent implements OnInit {

  breadcumb: BreadCumb;
  capitalfundingForm: FormGroup;

  allCompanies = [];

  edit: boolean;

  get createdBy() {
    return this.capitalfundingForm.get('createdBy');
  }

  get idFromControl() {
    return this.capitalfundingForm.get('_id');
  }

  get descriptionFormControl() {
    return this.capitalfundingForm.get('description');
  }

  get citiesFormControl() {
    return this.capitalfundingForm.get('cities') as FormArray;
  }

  get statusFormControl() {
    return this.capitalfundingForm.get('status');
  }

  get process(): FormArray {
    return this.capitalfundingForm.get('fundingProcess') as FormArray;
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
      title: 'Add Capital Funding',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Capital Funding'
        }
      ]
    };

    /** If it is "add-capitalfunding" route intialize empty capitalfunding form, but we are setting store property of "Selectedcapitalfunding" as null
     * and if it is "edit-capitalfunding route" we need to subscribe to get "Selectedcapitalfunding" and user refresh the tab,
     * there won't be any selected capitalfunding,
     * so we need to make the call to
     * get the capitalfunding by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig.path === 'add-capital-funding') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.capitalfundingFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.capitalfundingFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Post) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ capitalFundingId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected capitalfunding, so we need to make the call to
           * get the capitalfunding by fetching id from the params
           */
          if (params.capitalFundingId) {
            this.store.dispatch(GetPostById({ postId: params.capitalFundingId }));
          }
        })
      ).subscribe();
    }

    // this.capitalfundingFormInitialization();
  }

  ngOnInit() {
  }

  setProcessFormControl(hiringProcessSteps: any []) {
    const hiringProcessStepsControls = [];
    hiringProcessSteps.forEach((s) => {
      hiringProcessStepsControls.push(new FormControl(s));
    });
    return hiringProcessStepsControls;
  }

  capitalfundingFormInitialization(i: Post) {
    console.log(i && i.companies ? i.companies : []);
    this.capitalfundingForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      fundingBy: new FormControl(i && i.fundingBy ? i.fundingBy : []),
      fundingTo: new FormControl(i && i.fundingTo ? i.fundingTo : []),
      fundingDate: new FormControl(i && i.fundingDate ? i.fundingDate : []),
      fundingProcess: new FormArray(i && i.hiringProcess ? this.setProcessFormControl(i.fundingProcess) : [new FormControl([])]),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      fundingCurrency: new FormControl(i && i.fundingCurrency ? i.fundingCurrency : '$'),
      fundingAmount: new FormControl(i && i.fundingAmount ? i.fundingAmount : 10),
      type: new FormControl(PostType.CapitalFunding),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
    });

    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;
    });
  }

  async submit(status) {

    this.statusFormControl.setValue(status);

    /** Setting Up Steps Data Runtime while saving the form.by accessing the editor references */
    const steps = this.steps.toArray();
    this.process.controls.forEach(async (pC, i) => {
      const stepsBlocks =  await steps[i].editor.save();
      pC.setValue(stepsBlocks.blocks);
    });

    const blocks =  await this.descriptionEditor.editor.save();
    this.capitalfundingForm.get('description').setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.capitalfundingForm.removeControl('_id');
      const capitalfundingValue = { ...this.capitalfundingForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(capitalfundingValue);
      this.postService.addPost(capitalfundingValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    } else {
      const capitalfundingValue = { ...this.capitalfundingForm.value };

      /** Only Send _id */
      this.onlySendIdForTags(capitalfundingValue);
      this.postService.updatePost(capitalfundingValue).subscribe((j) => {
        if (j) {
          this.postService.redirectToPostDetails(j);
        }
      });
    }
  }

  onlySendIdForTags(capitalfundingValue) {
    capitalfundingValue.fundingBy = capitalfundingValue.fundingBy.map(c => c._id);
    capitalfundingValue.fundingTo = capitalfundingValue.fundingTo.map(c => c._id);
  }

  updateFormData(event) {
    console.log(this.steps.toArray());
    // this.capitalfundingForm.get('description').setValue(event);
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

  addStep(i: number) {
    this.process.insert(i + 1, new FormControl([]));
  }

  removeStep(i: number) {
    this.process.removeAt(i);
  }

  updateProcess(d, i: number) {
    this.process.at(i).setValue(d);
  }

}
