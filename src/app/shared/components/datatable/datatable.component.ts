import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../services/post.service';
import { DeletePost } from '../../../core/store/actions/post.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/state/app.state';
import { PostType } from '../../models/post-types.enum';
import { ProductService } from '../../../core/services/product.service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError, mapTo } from 'rxjs/operators';
import { SweetalertService } from '../../services/sweetalert.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() displayedColumns: string[];
  @Input() data: any[];
  @Input() length: number;
  @Input() pagination: false;

  @Input() dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() redirect = new EventEmitter();
  @Output() getAllPosts = new EventEmitter();

  constructor(
    public authService: AuthService,
    public postService: PostService,
    private productService: ProductService,
    private sweetAlertService: SweetalertService
  ) { }

  ngOnInit() {
    if (!this.pagination) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes && changes.length && changes.length.currentValue) {
      console.log(this.length);
    }
  }

  ngAfterViewInit() {
    // this.dataSource.paginator.length = 50;
    // If the user changes the sort order, reset back to the first page.
    if (this.pagination) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          catchError((e) => {
            return of(e);
          })
        )
        .subscribe(data => {
          if (this.pagination) {
            this.getAllPosts.emit({
              pageNumber: this.paginator.pageIndex + 1,
              limit: 25,
              sort: {
                field: this.sort.active,
                order: this.sort.direction
              }
            });
          }
          console.log(data);
        });
    }
  }

  deletePost(post, i: number) {

    this.sweetAlertService.confirmDelete(() => {
      this.dataSource._renderChangesSubscription = this.postService.deletePost(post._id, {name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser.name}).subscribe((d) => {
        if (d) {
          this.dataSource.data = this.dataSource.data.filter((d: any) => d._id !== post._id);
          this.length = this.length - 1;
          this.dataSource._updateChangeSubscription();
        }
      });
    });
  }

}
