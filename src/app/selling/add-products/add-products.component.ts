import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductStatus } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/shared/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddPrdouct } from 'src/app/core/store/actions/product.actions';

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
    this.auth.loggedInUser$.subscribe(u => {
      if (u) {
        this.productForm = new FormGroup({
          name: new FormControl(''),
          description: new FormControl(''),
          shortDescription: new FormControl(''),
          createdBy: new FormControl(u._id),
          totalPrice: new FormControl(0),
          categories: new FormControl([]),
          demo_url: new FormControl(''),
          documentation_url: new FormControl(''),
          video_url: new FormControl(''),
          status: new FormControl(ProductStatus.Created)
        });
      }
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
    this.store.dispatch(new AddPrdouct(this.productForm.value));
  }

}
