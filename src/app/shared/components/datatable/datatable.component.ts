import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {

  @Input() displayedColumns: string[];
  @Input() data: any[];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  constructor() { }

  ngOnInit() {
    console.log('data', this.data);
    this.dataSource.data = this.data;
    this.dataSource.sort = this.sort;
  }

}
