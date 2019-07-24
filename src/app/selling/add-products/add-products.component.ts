import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductStatus, Product } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddPrdouct, UpdatePrdouct, GetProductById, SetSelectedProduct } from 'src/app/core/store/actions/product.actions';
import { merge, of, Subscription } from 'rxjs';
import { selectSelectedProduct } from 'src/app/core/store/selectors/product.selectors';
import { tap, map, switchMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

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
  modules: {
    formula: true,
    // imageResize: {},
    syntax: true,
  };
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';

  get createdByFormControlValue() {
    return this.productForm.get('createdBy').value;
  }
  get idFromControlValue() {
    return this.productForm.get('_id').value;
  }

  subscription$: Subscription;

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
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
          return of({productId: ''});
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
      _id: new FormControl(p && p._id ? p._id : '')
    });
  }

  submit() {

    if (!this.createdByFormControlValue) {
      this.productForm.get('createdBy').setValue(this.auth.loggedInUser._id);
    }

    if (this.idFromControlValue) {
      this.store.dispatch(new UpdatePrdouct(this.productForm.value));
    } else {
      this.productForm.removeControl('_id');
      this.store.dispatch(new AddPrdouct(this.productForm.value));
    }
  }

}
