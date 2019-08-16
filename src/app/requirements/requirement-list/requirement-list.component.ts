import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { GetRequirementsByUserId } from 'src/app/core/store/actions/requirement.actions';
import { Observable } from 'rxjs';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { selectRequirementsList } from 'src/app/core/store/selectors/requirement.selectors';

@Component({
  selector: 'app-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss']
})
export class RequirementListComponent implements OnInit {

  requirementList$: Observable<Requirement[]>;
  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.authService.loggedInUser$.pipe(
      map((u: User) => u ? u._id : ''),
      tap((userId: string) => {
        if (userId) {
          this.store.dispatch(GetRequirementsByUserId());
        }
      })
    ).subscribe();
    this.requirementList$ = this.store.select(selectRequirementsList);
  }

}
