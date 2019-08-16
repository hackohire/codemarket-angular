import { Component, OnInit } from '@angular/core';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, tap } from 'rxjs/operators';
import { GetInterviewsByUserId } from 'src/app/core/store/actions/interview.actions';
import { User } from 'src/app/shared/models/user.model';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { selectAllHelpRequestsList, selectQueries } from 'src/app/core/store/selectors/help.selectors';
import { GetHelpRequestsByUserId } from 'src/app/core/store/actions/help.actions';

@Component({
  selector: 'app-help-request-list',
  templateUrl: './help-request-list.component.html',
  styleUrls: ['./help-request-list.component.scss']
})
export class HelpRequestListComponent implements OnInit {

  helpQueryList$: Observable<HelpQuery[]>;
  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.authService.loggedInUser$.pipe(
      map((u: User) => u ? u._id : ''),
      tap((userId: string) => {
        if (userId) {
          this.store.dispatch(GetHelpRequestsByUserId());
        }
      })
    ).subscribe();
    this.helpQueryList$ = this.store.select(selectQueries);
  }

}
