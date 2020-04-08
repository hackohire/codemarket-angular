import { Component, OnInit , ViewChild} from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { MakemoneyonlineService } from '../makemoneyonline.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-makemoneylist',
  templateUrl: './makemoneylist.component.html',
  styleUrls: ['./makemoneylist.component.scss']
})
export class MakemoneylistComponent implements OnInit {

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
    public makemoneyonlineService: MakemoneyonlineService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService,
    private store: Store<AppState>,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.breadcumb = {
      title: 'List of Make Money Online',
    };

    this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'haveBusiness','describeBusiness','WebsiteLink','businessAddress'];
    this.mokemoneyListSubscription = this.makemoneyonlineService.fetchMakeMoney().subscribe((makemoneylist) => {
      this.dataSource.data = makemoneylist;
      this.datasource1 = makemoneylist;
      console.log(makemoneylist)
    });
    
  }

}
