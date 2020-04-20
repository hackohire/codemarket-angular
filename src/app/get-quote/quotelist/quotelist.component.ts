import { Component, OnInit , ViewChild} from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { QuoteService } from '../quote.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-makemoneylist',
  templateUrl: './quotelist.component.html',
  styleUrls: ['./quotelist.component.scss']
})
export class QuoteListComponent implements OnInit {

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  all: boolean;
  authorId: string;
  breadcumb: BreadCumb;
  type: string;
  datasource1;

  userSubsription: Subscription;
  mokemoneyListSubscription: Subscription;



  constructor(
    public quoteService: QuoteService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService,
    private store: Store<AppState>,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.breadcumb = {
      title: 'Quote List',
    };

    this.displayedColumns = ['firstName','email', 'phone', 'description','insuranceType'];
    this.mokemoneyListSubscription = this.quoteService.fetchquotes().subscribe((quotelist) => {
      this.dataSource.data = quotelist;
      this.datasource1 = quotelist;
      console.log(quotelist)
    });
    
  }

}
