import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductStatus, Product } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddPrdouct, UpdatePrdouct, GetProductById, SetSelectedProduct } from 'src/app/core/store/actions/product.actions';
import { of, Subscription } from 'rxjs';
import { selectSelectedProduct } from 'src/app/core/store/selectors/product.selectors';
import { tap, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HighlightResult, HighlightJS } from 'ngx-highlightjs';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit, OnDestroy {
  productRoute = {
    'ADD_PRODUCT': 'add-product',
    'EDIT_PRODUCT': 'edit-product'
  };
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

  get snippetsFormControl() {
    return this.productForm.get('snippets');
  }

  subscription$: Subscription;

  response: HighlightResult;

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private _hljs: HighlightJS
  ) {

    /** If it is "add-product" route intialize empty product form, but we are setting store property of "SelectedProduct" as null
     * and if it is "edit-product route" we need to subscribe to get "SelectedProduct" and user refresh the tab,
     * there won't be any selected product,
     * so we need to make the call to
     * get the product by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-product') {
      this.store.dispatch(new SetSelectedProduct(null));
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
            this.store.dispatch(new GetProductById(params.productId));
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
      snippets: new FormControl(p && p.snippets.length ? p.snippets : null)
    });
  }

  submit() {


    const codeSnippets = [].slice.call(document.getElementsByTagName('pre'), 0);
    if (codeSnippets.length) {
      const snips = [];
      for (const s of codeSnippets) {
        const snip = this._hljs.highlightAuto(s.innerText, ['javascript', 'typescript', 'scss']);
        snips.push(snip);
      }
      this.productForm.value.snips = snips;
    }

    if (!this.createdByFormControlValue) {
      this.productForm.get('createdBy').setValue(this.auth.loggedInUser._id);
    }

    if (this.idFromControl.value) {
      this.store.dispatch(new UpdatePrdouct(this.productForm.value));
    } else {
      this.productForm.removeControl('_id');
      this.store.dispatch(new AddPrdouct(this.productForm.value));
    }
  }


  
  onHighlight(e) {
    if(e) {
      
      // console.log(this._hljs.highlightAuto(e, ['javascript, typescript']));
    }
    this.response = {
      language: e.language,
      r: e.r,
      second_best: '{...}',
      top: '{...}',
      value: '{...}'
    };
    console.log(this.response);
  }

}
