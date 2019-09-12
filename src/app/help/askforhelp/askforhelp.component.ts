import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddQuery, SetSelectedHelpRequest, GetHelpRequestById, UpdateHelpRequest } from 'src/app/core/store/actions/help.actions';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { tap, switchMap, startWith, map } from 'rxjs/operators';
import { selectSelectedQuery } from 'src/app/core/store/selectors/help.selectors';
import { FormService } from 'src/app/shared/services/form.service';
import { Tag } from 'src/app/shared/models/product.model';
import { MatAutocomplete } from '@angular/material';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Component({
  selector: 'app-askforhelp',
  templateUrl: './askforhelp.component.html',
  styleUrls: ['./askforhelp.component.scss']
})
export class AskforhelpComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  askForHelpForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  edit: boolean;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  searchText = new FormControl();
  tagSuggestions: Tag[];
  allTags: Tag[];

  @ViewChild('searchInput', {static: false}) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  get createdBy() {
    return this.askForHelpForm.get('createdBy');
  }

  get idFromControl() {
    return this.askForHelpForm.get('_id');
  }

  get descriptionFormControl() {
    return this.askForHelpForm.get('description');
  }

  get tagsFormControl() {
    return this.askForHelpForm.get('tags') as FormArray;
  }

  get supportDescriptionFormControl() {
    return this.askForHelpForm.get('support').get('description');
  }

  get statusFormControl() {
    return this.askForHelpForm.get('status');
  }

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {

    this.breadcumb = {
      title: 'Ask For Help By Filling out the given form',
      path: [
        {
          name: 'Dashboard'
        },
        {
          name: 'Help'
        }
      ]
    };

    /** If it is "add-helpRequest" route intialize empty helpRequest form, but we are setting store property of "SelectedhelpRequest" as null
     * and if it is "edit-helpRequest route" we need to subscribe to get "SelectedhelpRequest" and user refresh the tab,
     * there won't be any selected helpRequest,
     * so we need to make the call to
     * get the helpRequest by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-help-request') {
      this.store.dispatch(SetSelectedHelpRequest({ helpRequest: null }));
      this.askForHelpFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedQuery).pipe(
        tap((h: HelpQuery) => {
          this.askForHelpFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: HelpQuery) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ helpRequestId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected helpRequest, so we need to make the call to
           * get the helpRequest by fetching id from the params
           */
          if (params.helpRequestId) {
            this.store.dispatch(GetHelpRequestById({ helpRequestId: params.helpRequestId }));
          }
        })
      ).subscribe();
    }

    // this.askForHelpFormInitialization();
  }

  ngOnInit() {
  }


  askForHelpFormInitialization(h: HelpQuery): void {
    this.askForHelpForm = new FormGroup({
      name: new FormControl(h && h.name ? h.name : '', Validators.required),
      description: new FormControl(h && h.description ? h.description : 0),
      price: new FormControl(h && h.price ? h.price : 0, Validators.required),
      createdBy: new FormControl(h && h.createdBy && h.createdBy._id ? h.createdBy._id : ''),
      // shortDescription: new FormControl(h && h.shortDescription ? h.shortDescription : ''),
      categories: new FormControl(h && h.categories ? h.categories : []),
      // demo_url: new FormControl(h && h.demo_url ? h.demo_url : '', [Validators.pattern(this.urlRegex)]),
      // documentation_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      // video_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(h && h.status ? h.status : PostStatus.Drafted),
      _id: new FormControl(h && h._id ? h._id : ''),
      tags: this.fb.array(h && h.tags && h.tags.length ? h.tags : []),
      support: new FormGroup({
        time: new FormControl(h && h.support && h.support.time ? h.support.time : 0),
        description: new FormControl(h && h.support && h.support.description ? h.support.description : '')
      })
      // snippets: new FormControl(null),
    });

    this.formService.searchCategories('').subscribe((tags) => {
      this.tagSuggestions = tags;
      this.allTags = tags;
    })

    this.searchText.valueChanges.pipe(
      startWith(''),
      map((text) => text ? this._filter(text) : this.allTags && this.allTags.length ? this.allTags.slice() : []))
      .subscribe((tags) => this.tagSuggestions = tags);

  }

  private _filter(value): Tag[] {
    const filterValue = value && value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  submit(status) {
    // console.log(this.askForHelpForm.value);

    /* Identify the programming language based on code snippets  **/
    // const codeSnippets = [].slice.call(document.getElementsByTagName('pre'), 0);
    // if (codeSnippets.length) {
    //   const snips = [];
    //   for (const s of codeSnippets) {
    //     const snip = this._hljs.highlightAuto(s.innerText, ['javascript', 'typescript', 'scss']);
    //     snips.push(snip);
    //   }
    //   this.askForHelpForm.value.snips = snips;
    //   console.log(snips);
    // }
    this.statusFormControl.setValue(status);

    if (!this.supportDescriptionFormControl.value) {
      this.supportDescriptionFormControl.setValue([]);
    }

    if (!this.descriptionFormControl.value) {
      this.descriptionFormControl.setValue([]);
    }

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.askForHelpForm.removeControl('_id');
      this.store.dispatch(AddQuery({helpRequest: this.askForHelpForm.value}));
    } else {
      this.store.dispatch(UpdateHelpRequest({helpRequest: this.askForHelpForm.value}));
    }

  }

  updateFormData(event) {
    console.log(event);
    this.askForHelpForm.get('description').setValue(event);
  }

  updateSupportDescription(event) {
    this.supportDescriptionFormControl.setValue(event);
  }

  addTech(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      this.formService.addCategory(this.tagsFormControl, event);
      this.searchText.setValue(null);
    }
  }

  selected(event) {
    this.formService.selectedCategory(this.tagsFormControl, event);
    this.searchInput.nativeElement.value = null;
    this.searchText.setValue(null);
  }


  // Remove a Tag
  public remove(index: number): void {
    this.formService.removeCategory(this.tagsFormControl, index)
  }

}
