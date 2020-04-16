import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Product, Tag } from '../../shared/models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { of, Subscription } from 'rxjs';
import { tap, switchMap, startWith, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormService } from '../../shared/services/form.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { PostType } from '../../shared/models/post-types.enum';
import { AddPost, UpdatePost, GetPostById, SetSelectedPost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { EditorComponent } from '../../shared/components/editor/editor.component';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [COMMA, ENTER];
  searchText = new FormControl();

  productForm: FormGroup;

  get createdByFormControlValue() {
    return this.productForm.get('createdBy').value;
  }
  get idFromControl() {
    return this.productForm.get('_id');
  }

  get descriptionFormControl() {
    return this.productForm.get('description');
  }

  get supportDescriptionFormControl() {
    return this.productForm.get('support').get('description');
  }

  // get snippetsFormControl() {
  //   return this.productForm.get('snippets');
  // }

  get priceAndFilesArrayFormControl() {
    return this.productForm.get('priceAndFiles') as FormArray;
  }

  get tagsFormControl() {
    return this.productForm.get('tags') as FormArray;
  }

  get statusFormControl() {
    return this.productForm.get('status');
  }

  breadcumb: BreadCumb;

  subscription$: Subscription;

  tags: Tag[];

  @ViewChild('file') file;
  public files: File[];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  tagSuggestions: Tag[];
  allTags: Tag[];

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild('descriptionEditor') descriptionEditor: EditorComponent;
  @ViewChild('supportDescriptionEditor') supportDescriptionEditor: EditorComponent;

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private formService: FormService
  ) {

    this.breadcumb = {
      title: 'Add the Coding Problems you face in your day to day life with their solution, And start earning passive income',
      path: [

        {
          name: PostType.Product
        }
      ]
    };


    /** If it is "add-product" route intialize empty product form, but we are setting store property of "SelectedProduct" as null
     * and if it is "edit-product route" we need to subscribe to get "SelectedProduct" and user refresh the tab,
     * there won't be any selected product,
     * so we need to make the call to
     * get the product by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === `add-${PostType.Product}`) {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.productFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((p: Product) => {
          this.productFormInitialization(p);
        }),
        switchMap((p: Product) => {
          if (!p) {
            return this.activatedRoute.params;
          }
          return of({ productId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected product, so we need to make the call to
           * get the product by fetching id from the params
           */
          if (params.productId) {
            this.store.dispatch(GetPostById({ postId: params.productId }));
          }
        })
      ).subscribe();
    }
  }

  ngOnInit() {
  }



  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  productFormInitialization(p: Product) {
    this.productForm = new FormGroup({
      name: new FormControl(p && p.name ? p.name : '', Validators.required),
      description: new FormControl(p && p.description ? p.description : ''),
      createdBy: new FormControl(p && p.createdBy && p.createdBy._id ? p.createdBy._id :
        (this.auth.loggedInUser ? this.auth.loggedInUser._id : '')),
      price: new FormControl(p && p.price ? p.price : 0, Validators.required),
      categories: new FormControl(p && p.categories ? p.categories : []),
      status: new FormControl(p && p.status ? p.status : PostStatus.Drafted),
      _id: new FormControl(p && p._id ? p._id : ''),
      tags: this.fb.array(p && p.tags && p.tags.length ? p.tags : []),
      type: new FormControl(PostType.Product),
      support: new FormGroup({
        time: new FormControl(p && p.support && p.support.time ? p.support.time : 0),
        description: new FormControl(p && p.support && p.support.description ? p.support.description : '')
      })
    });

    this.formService.findFromCollection('', 'tags').subscribe((tags) => {
      this.tagSuggestions = tags;
      this.allTags = tags;
    });

    this.searchText.valueChanges.pipe(
      startWith(''),
      map((text) => text ? this._filter(text) : this.allTags && this.allTags.length ? this.allTags.slice() : []))
      .subscribe((tags) => this.tagSuggestions = tags);

  }

  private _filter(value): Tag[] {
    const filterValue = value && value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  priceAndFilesFormControl(f) {
    return new FormGroup({
      fileName: new FormControl(f.name),
      file: new FormControl(f.key ? f.key : ''),
      price: new FormControl(f.price ? f.price : 0),
      progress: new FormControl(f.progress ? f.progress : 0)
    });
  }

  async submit(status) {

    if (!this.auth.loggedInUser) {
      this.auth.checkIfUserIsLoggedIn(true);
      return;
    }

    this.statusFormControl.setValue(status);

    const supportBlocks =  await this.supportDescriptionEditor.editor.save();
    this.supportDescriptionFormControl.setValue(supportBlocks.blocks);

    const blocks =  await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    /* Identify the programming language based on code snippets  **/
    // const codeSnippets = [].slice.call(document.getElementsByTagName('pre'), 0);
    // if (codeSnippets.length) {
    //   const snips = [];
    //   for (const s of codeSnippets) {
    //     const snip = this._hljs.highlightAuto(s.innerText, ['javascript', 'typescript', 'scss']);
    //     snips.push(snip);
    //   }
    //   this.productForm.value.snips = snips;
    //   console.log(snips);
    // }

    /* Set LoggedInUserId as created By if it is not already set **/
    if (!this.createdByFormControlValue) {
      this.productForm.get('createdBy').setValue(this.auth.loggedInUser._id);
    }

    if (this.idFromControl && this.idFromControl.value) {
      this.store.dispatch(UpdatePost({post: this.productForm.value}));
    } else {
      this.productForm.removeControl('_id');
      this.store.dispatch(AddPost({ post: this.productForm.value }));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.descriptionFormControl.setValue(event);
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
    this.formService.removeCategory(this.tagsFormControl, index);
  }

}
