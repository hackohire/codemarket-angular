import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { GetRequirementsByUserId, DeleteRequirement } from 'src/app/core/store/actions/requirement.actions';
import { Observable, Subscription } from 'rxjs';
import { selectRequirementsList } from 'src/app/core/store/selectors/requirement.selectors';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequirementListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedRequirement: Requirement | null;


  userSubsription: Subscription;
  requirementsListSubscription: Subscription;

  helpQueryList$: Observable<Requirement[]>;

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
          this.store.dispatch(GetRequirementsByUserId({ userId: u._id, status: ''}));
        }
      })
    ).subscribe();

    this.requirementsListSubscription = this.store.select(selectRequirementsList).pipe(
      map((requirements) => {
        if (requirements) {
          this.dataSource.data = requirements;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.requirementsListSubscription) {
      this.requirementsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.requirementsListSubscription.unsubscribe();
    }
  }

  editRequirement(requirement): void {
    // this.store.dispatch(SetSelectedRequirement({requirement}));
    // this.router.navigate(['/add-requirement'], );
  }

  deleteRequirement(requirementId: string) {
    this.store.dispatch(DeleteRequirement({requirementId}));
  }

  redirectToRequirementDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'requirement-details', details._id]}}]);
  }


}
