import { Component, OnInit, Input, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort, MatPaginator } from '@angular/material';
import { merge, of } from 'rxjs';
import { startWith, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements AfterViewInit {

  @Input() length: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @Output() fetchData = new EventEmitter();

  constructor() { }

  ngAfterViewInit() {
    this.paginator.pageSize = 10;
    merge(this.paginator.page)
    .pipe(
      startWith({}),
      catchError((e) => {
        return of(e);
      })
    )
    .subscribe(data => {
      this.fetchData.emit(this.paginator);
    });
  }

}
