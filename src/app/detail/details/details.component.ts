import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { Interview } from 'src/app/shared/models/interview.model';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { GetHelpRequestById } from 'src/app/core/store/actions/help.actions';
import { ActivatedRoute } from '@angular/router';
import { selectSelectedQuery } from 'src/app/core/store/selectors/help.selectors';
import { GetInterviewById } from 'src/app/core/store/actions/interview.actions';
import { selectSelectedInterview } from 'src/app/core/store/selectors/interview.selectors';
import { selectSelectedRequirement } from 'src/app/core/store/selectors/requirement.selectors';
import { GetRequirementById } from 'src/app/core/store/actions/requirement.actions';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  details$: Observable<HelpQuery | Requirement | Interview>;
  subscription$: Subscription;
  breadcumb: BreadCumb;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
  ) {
    this.breadcumb = {
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        }
      ]
    };
  }

  ngOnInit() {

    const params = this.activatedRoute.snapshot.params;

    if (params['helpRequestId']) {

      this.subscription$ = this.store.select(selectSelectedQuery).pipe(
        tap((p: HelpQuery) => {
          if (p) {
            this.details$ = of(p);
          } else {
            const params = this.activatedRoute.snapshot.params;
            this.store.dispatch(GetHelpRequestById({ helpRequestId: params.helpRequestId }));
            this.details$ = this.store.select(selectSelectedQuery);
          }

        })
      ).subscribe();

    } else if (params['interviewId']) {
      this.subscription$ = this.store.select(selectSelectedInterview).pipe(
        tap((p: Interview) => {
          if (p) {
            this.details$ = of(p);
          } else {
            this.store.dispatch(GetInterviewById({ interviewId: params.interviewId }));
            this.details$ = this.store.select(selectSelectedInterview);
          }
        })
      ).subscribe();

    } else if (params['requirementId']) {
      this.subscription$ = this.store.select(selectSelectedRequirement).pipe(
        tap((p: Requirement) => {
          if (p) {
            this.details$ = of(p);
          } else {
            this.store.dispatch(GetRequirementById({ requirementId: params.requirementId }));
            this.details$ = this.store.select(selectSelectedRequirement);
          }
        })
      ).subscribe();
    }



  }

  getDate(d: string) {
    return new Date(+d);
  }

}
