import { Component, OnInit, Input, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of } from 'rxjs';
import { startWith, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements AfterViewInit {

  @Input() length: number; /** Total number of elements */
  @ViewChild(MatPaginator) paginator: MatPaginator; /** Mat Paginator Trmplate Reference  */

  @Output() fetchData = new EventEmitter();

  constructor() { }

  ngAfterViewInit() {
    this.paginator.pageSize = 10;     /** By default, number of element in single page is 10 */

    /** Wheneve user changes number of elements / next or previous page */
    merge(this.paginator.page)
    .pipe(
      startWith({}),
      catchError((e) => {
        return of(e);
      })
    )
    .subscribe(data => {
      /** Inform the parent component to make the API call to fetch the next page */
      this.fetchData.emit(this.paginator);
    });
  }

}
