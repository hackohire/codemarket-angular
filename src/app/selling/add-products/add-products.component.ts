import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductStatus, Product } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/shared/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddPrdouct } from 'src/app/core/store/actions/product.actions';
import { merge } from 'rxjs';
import { selectSelectedProduct } from 'src/app/core/store/selectors/product.selectors';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  productForm: FormGroup;
  modules: any;

  constructor(
    public auth: AuthService,
    private store: Store<AppState>
  ) {

    this.store.select(selectSelectedProduct).subscribe((p: Product) => {
      this.productForm = new FormGroup({
        name: new FormControl(p && p.name ? p.name : ''),
        description: new FormControl(p && p.description ? p.description : ''),
        shortDescription: new FormControl(p && p.shortDescription ? p.shortDescription : ''),
        createdBy: new FormControl(p && p.createdBy ? p.createdBy : ''),
        totalPrice: new FormControl(p && p.totalPrice ? p.totalPrice : 0),
        categories: new FormControl(p && p.categories ? p.categories : []),
        demo_url: new FormControl(p && p.demo_url ? p.demo_url : ''),
        documentation_url: new FormControl(p && p.documentation_url ? p.documentation_url : ''),
        video_url: new FormControl(p && p.video_url ? p.video_url : ''),
        status: new FormControl(p && p.status ? p.status : ProductStatus.Created)
      });
    });
  }

  ngOnInit() {
    this.modules = {
      formula: true,
      // imageResize: {},
      syntax: true,
    };
  }

  submit() {
    this.productForm.get('createdBy').setValue(this.auth.loggedInUser._id);
    this.store.dispatch(new AddPrdouct(this.productForm.value));
  }

}
