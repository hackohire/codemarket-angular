import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-selling-products',
  templateUrl: './selling-products.component.html',
  styleUrls: ['./selling-products.component.scss']
})
export class SellingProductsComponent implements OnInit {
  navLinks = [];
  constructor() {
    this.navLinks = [
      {
        path: 'products-list',
        label: 'Bugfixes'
      },
      {
        path: 'add-product',
        label: 'Add Bugfix'
      }
    ];
  }

  ngOnInit() {
  }

}
