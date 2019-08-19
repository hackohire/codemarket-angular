import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ProductStatus, Product, Tag } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddPrdouct, UpdatePrdouct, GetProductById, SetSelectedProduct } from 'src/app/core/store/actions/product.actions';
import { of, Subscription, Subject } from 'rxjs';
import { selectSelectedProduct } from 'src/app/core/store/selectors/product.selectors';
import { tap, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HighlightJS } from 'ngx-highlightjs';
import { Storage } from 'aws-amplify';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  productForm: FormGroup;
  modules = {
    formula: true,
    // imageResize: {},
    syntax: true,
  };
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';

  get createdByFormControlValue() {
    return this.productForm.get('createdBy').value;
  }
  get idFromControl() {
    return this.productForm.get('_id');
  }

  get descriptionFormControl() {
    return this.productForm.get('description');
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

  breadcumb: BreadCumb;

  subscription$: Subscription;

  tags: Tag[];

  @ViewChild('file', { static: false }) file;
  public files: File[];

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private _hljs: HighlightJS,
    private fb: FormBuilder
  ) {

    this.breadcumb = {
      title: 'Add the Coding Problems you face in your day to day life with their solution, And start earning passive income',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Product'
        }
      ]
    };

    /** If it is "add-product" route intialize empty product form, but we are setting store property of "SelectedProduct" as null
     * and if it is "edit-product route" we need to subscribe to get "SelectedProduct" and user refresh the tab,
     * there won't be any selected product,
     * so we need to make the call to
     * get the product by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-product') {
      this.store.dispatch(SetSelectedProduct({ product: null }));
      this.productFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedProduct).pipe(
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
            this.store.dispatch(GetProductById({ productId: params.productId }));
          }
        })
      ).subscribe();
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  productFormInitialization(p: Product): void {
    this.productForm = new FormGroup({
      name: new FormControl(p && p.name ? p.name : ''),
      description: new FormControl(p && p.description ? p.description : ''),
      shortDescription: new FormControl(p && p.shortDescription ? p.shortDescription : ''),
      createdBy: new FormControl(p && p.createdBy ? p.createdBy : ''),
      totalPrice: new FormControl(p && p.totalPrice ? p.totalPrice : 0),
      categories: new FormControl(p && p.categories ? p.categories : []),
      demo_url: new FormControl(p && p.demo_url ? p.demo_url : '', [Validators.pattern(this.urlRegex)]),
      documentation_url: new FormControl(p && p.documentation_url ? p.documentation_url : '', [Validators.pattern(this.urlRegex)]),
      video_url: new FormControl(p && p.video_url ? p.video_url : '', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(p && p.status ? p.status : ProductStatus.Created),
      _id: new FormControl(p && p._id ? p._id : ''),
      tags: this.fb.array(p && p.tags && p.tags.length ? p.tags : []),
      // snippets: new FormControl(p && p.snippets && p.snippets.length ? p.snippets : null),
      priceAndFiles: new FormArray([])
    });
  }

  priceAndFilesFormControl(f) {
    return new FormGroup({
      fileName: new FormControl(f.name),
      file: new FormControl(f.key ? f.key : ''),
      price: new FormControl(f.price ? f.price : 0),
      progress: new FormControl(f.progress ? f.progress : 0)
    });
  }

  submit() {

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
      if (this.tagsFormControl.value && this.tagsFormControl.value.length) {
        this.tagsFormControl.value.forEach((t) => delete t['__typename']);
      }

      if (this.descriptionFormControl.value && this.descriptionFormControl.value.length) {
        this.descriptionFormControl.value.forEach((t) => {
          delete t['__typename'];
          if (t.data['__typename']) {
            delete t.data['__typename'];
          }
          return t;
        });
      }
      this.productForm.get('createdBy').setValue(this.auth.loggedInUser._id);
    }

    if (this.idFromControl && this.idFromControl.value) {
      this.store.dispatch(UpdatePrdouct({product: this.productForm.value}));
    } else {
      this.productForm.removeControl('_id');
      this.store.dispatch(AddPrdouct({ product: this.productForm.value }));
    }
  }


  addFiles() {
    this.file.nativeElement.click();
  }


  onFilesAdded() {
    // const files: { [key: string]: File } = this.file.nativeElement.files;
    const files: File[] = Array.from(this.file.nativeElement.files);
    if (this.files && this.files.length && files.length) {
      this.files = this.files.concat(files);
    } else {
      this.files = files;
    }
    const priceAndFiles = this.priceAndFilesArrayFormControl;


    this.files.forEach((f, i) => {
      console.log(f);

      if (!f['progress']) {

        priceAndFiles.push(this.priceAndFilesFormControl({ name: f.name }));

        // create a new progress-subject for every file
        f['progress'] = new Subject<number>();
        priceAndFiles.at(i).get('progress').setValue(new Subject<number>());

        const fileNameSplitArray = f.name.split('.');
        const fileExt = fileNameSplitArray.pop();
        const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;

        Storage.vault.put(fileName, f, {

          bucket: 'codemarket-files',

          level: 'public',

          contentType: f.type,

          progressCallback: (p) => {

            console.log(`Uploaded: ${p.loaded}/${p.total}`);

            // calculate the progress percentage
            const percentDone = Math.round(100 * p.loaded / p.total);
            priceAndFiles.at(i).get('progress').value.next(percentDone);
            f['progress'].next(percentDone);

            if (p.loaded === p.total) {
              priceAndFiles.at(i).get('progress').value.complete();
              f['progress'].complete();
            }
          },
        }).then((uploaded: any) => {
          console.log('uploaded', uploaded);
          priceAndFiles.at(i).get('file').setValue(uploaded.key);
          priceAndFiles.at(i).get('progress').disable();

        });
      }
    });
    this.file.nativeElement.value = null;

    console.log(this.files);
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.priceAndFilesArrayFormControl.removeAt(index);
  }

  updateFormData(event) {
    console.log(event);
    this.productForm.get('description').setValue(event, { emitEvent: false, onlySelf: true });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const arrayFormControl: FormArray = this.tagsFormControl;
      const a = new FormControl({name: value.trim()});
      arrayFormControl.controls.push(a);
      arrayFormControl.value.push({name: value.trim()});
      this.productForm.updateValueAndValidity({emitEvent: true});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  // Remove a Tag
  public remove(index: number): void {
    const arrayFormControl: FormArray = this.tagsFormControl;
    arrayFormControl.value.splice(index, 1);
    this.productForm.updateValueAndValidity();
  }

}
