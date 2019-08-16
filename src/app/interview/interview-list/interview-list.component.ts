import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable } from 'rxjs';
import { Interview } from 'src/app/shared/models/interview.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { GetInterviewsByUserId } from 'src/app/core/store/actions/interview.actions';
import { selectInterviewsList } from 'src/app/core/store/selectors/interview.selectors';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss']
})
export class InterviewListComponent implements OnInit {

  interViewList$: Observable<Interview[]>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.loggedInUser$.pipe(
      map((u: User) => u ? u._id : ''),
      tap((userId: string) => {
        if (userId) {
          this.store.dispatch(GetInterviewsByUserId());
        }
      })
    ).subscribe();
    this.interViewList$ = this.store.select(selectInterviewsList);
  }

}
