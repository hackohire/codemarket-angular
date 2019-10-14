import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../services/post.service';
import { DeletePost } from '../../../core/store/actions/post.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/state/app.state';
import { PostType } from '../../models/post-types.enum';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit, OnChanges {

  @Input() displayedColumns: string[];
  @Input() data: any[];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Output() redirect = new EventEmitter();

  constructor(
    public authService: AuthService,
    public postService: PostService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    console.log('data', this.data);
    this.dataSource.data = this.data;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.data && changes.data.currentValue) {
      console.log(changes.data.currentValue)
      this.dataSource.data = changes.data.currentValue;
    }
  }

  deletePost(post, i: number) {
    if (post.type === PostType.Product) {
      this.dataSource._renderChangesSubscription = this.productService.deleteProduct(post._id).subscribe((d) => {
        if(d) {
          this.dataSource.data = this.dataSource.data.filter((d: any) => d._id !== post._id);
          this.dataSource._updateChangeSubscription();
        }
      });  
    } else {
      this.dataSource._renderChangesSubscription = this.postService.deletePost(post._id).subscribe((d) => {
        if(d) {
          this.dataSource.data = this.dataSource.data.filter((d: any) => d._id !== post._id);
          this.dataSource._updateChangeSubscription();
        }
      });
    }
  }

}
