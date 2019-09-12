import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { GetHowtodocsByUserId, DeleteHowtodoc } from 'src/app/core/store/actions/howtodoc.actions';
import { selectHowtodocsList } from 'src/app/core/store/selectors/howtodoc.selectors';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-howtodoc-list',
  templateUrl: './howtodoc-list.component.html',
  styleUrls: ['./howtodoc-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HowtodocListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedHowtodoc: Howtodoc | null;


  userSubsription: Subscription;
  howtodocsListSubscription: Subscription;

  helpQueryList$: Observable<Howtodoc[]>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit() {

    this.userSubsription = this.authService.loggedInUser$.pipe(
      map((u) => {
        if (u) {
          this.store.dispatch(GetHowtodocsByUserId({ userId: u._id, status: ''}));
        }
      })
    ).subscribe();

    this.howtodocsListSubscription = this.store.select(selectHowtodocsList).pipe(
      map((howtodocs) => {
        if (howtodocs) {
          this.dataSource.data = howtodocs;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.howtodocsListSubscription) {
      this.howtodocsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.howtodocsListSubscription.unsubscribe();
    }
  }


  editHowtodoc(howtodoc): void {
    // this.store.dispatch(SetSelectedHowtodoc({howtodoc}));
    // this.router.navigate(['/add-howtodoc'], );
  }

  deleteHowtodoc(howtodocId: string) {
    this.store.dispatch(DeleteHowtodoc({howtodocId}));
  }

  redirectToHowtodocDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'howtodoc-details', details._id]}}]);
  }

}
