import { Injectable } from '@angular/core';
import { Goal } from '../shared/models/goal.model';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../core/services/auth.service';
import { SetSelectedGoal } from '../core/store/actions/goal.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  goalQueryFields = gql`
  fragment Goal on Goal {
    _id
    name
    categories
    description {
      ...Description
    }
    price
    status
    createdAt
    updatedAt
    tags {
      name
      _id
    }
    support {
      time
      description {
        ...Description
      }
    }
    likeCount
    createdBy {
      _id
      name
      avatar
    }
  }
  ${description}
  `;

  constructor(
    private apollo: Apollo,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }


  getGoalsByUserId(userId: string, status: string): Observable<Goal[]> {
    return this.apollo.query(
      {
        query: gql`
          query getGoalsByUserId($userId: String, $status: String) {
            getGoalsByUserId(userId: $userId, status: $status) {
              ...Goal
            }
          }
          ${this.goalQueryFields}
        `,
        variables: {
          userId: userId,
status: status
        },
        fetchPolicy:  'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getGoalsByUserId;
      }),
    );
  }


  getAllGoals(): Observable<Goal[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllGoals {
            getAllGoals {
              ...Goal
            }
          }
          ${this.goalQueryFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllGoals;
      }),
    );
  }

  getGoalById(GoalId: string): Observable<Goal> {
    return this.apollo.query(
      {
        query: gql`
          query getGoalById($GoalId: String) {
            getGoalById(goalId: $GoalId) {
              ...Goal
            }
          }
          ${this.goalQueryFields}
        `,
        variables: {
          GoalId: GoalId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getGoalById;
      }),
    );
  }


  addGoal(goal: Goal): Observable<Goal> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addGoal($goal: GoalInput) {
          addGoal(goal: $goal) {
            ...Goal
          }
        }
        ${this.goalQueryFields}
      `,
      variables: {
        goal: goal
      }
    }).pipe(
      map(q => q.data.addGoal)
    );
  }

  updateGoal(goal: Goal): Observable<Goal> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateGoal($goal: GoalInput) {
            updateGoal(goal: $goal) {
              ...Goal
            }
          }
          ${this.goalQueryFields}
        `,
        variables: {
          goal: goal
        }
      }
    ).pipe(
      map((p) => p.data.updateGoal),
    );
  }

  deleteGoal(goalId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteGoal($goalId: String) {
            deleteGoal(goalId: $goalId)
          }
        `,
        variables: {
          goalId: goalId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteGoal;
      }),
    );
  }

  redirectToGoalDetails(goal: Goal): void {
    this.store.dispatch(SetSelectedGoal({ goal }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'goal-details', goal._id] } }]);
  }
}
