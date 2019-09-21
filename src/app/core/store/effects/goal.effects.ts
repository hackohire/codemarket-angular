import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddGoal, GoalAddedSuccessfully, GetGoalsByUserId, GoalList, GetGoalById, SetSelectedGoal, GetAllGoals, SetAllGoalsList, UpdateGoal, GoalUpdated, DeleteGoal } from '../actions/goal.actions';
import { GoalService } from 'src/app/goal/goal.service';
import { Goal } from 'src/app/shared/models/goal.model';
import { selectGoalsList } from '../selectors/goal.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Injectable()
export class GoalEffects {

    @Effect()
    addGoal$ = this.actions$.pipe(
        ofType(AddGoal),
        map(action => action.goal),
        switchMap((goal) => this.goalService.addGoal(goal)),
        map((goal: Goal) => {

            if (goal && goal.status === PostStatus.Drafted) {
                this.sweetAlertService.success('Goal has been Drafted Successfully', '', 'success');
            }

            if (goal && goal.status === PostStatus.Published) {
                this.sweetAlertService.success('Goal has been Published Successfully', '', 'success');
            }

            this.goalService.redirectToGoalDetails(goal);
            return GoalAddedSuccessfully({goal});
        }),
    );

    @Effect()
    getGoalsByUserId$ = this.actions$.pipe(
        ofType(GetGoalsByUserId),
        switchMap((value) => this.goalService.getGoalsByUserId(value.userId, value.status)),
        tap(u => console.log(u)),
        map((goal: Goal[]) => {
            console.log(goal);
            return GoalList({goal});
        })
    );

    @Effect()
    getGoalById$ = this.actions$.pipe(
        ofType(GetGoalById),
        map(action => action.goalId),
        switchMap((goalId) => this.goalService.getGoalById(goalId)),
        tap(u => console.log(u)),
        map((goal: Goal) => {
            console.log(goal);
            return SetSelectedGoal({goal});
        })
    );


    @Effect()
    getAllGoalsList$ = this.actions$.pipe(
        ofType(GetAllGoals),
        switchMap(() => this.goalService.getAllGoals()),
        tap(u => console.log(u)),
        map((goal: Goal[]) => {
            console.log(goal);
            return SetAllGoalsList({goal});
        })
    );

    @Effect()
    updateGoal$ = this.actions$.pipe(
        ofType(UpdateGoal),
        map(action => action.goal),
        switchMap((goal) => this.goalService.updateGoal(goal)),
        tap(u => console.log(u)),
        map((goal: Goal) => {
            console.log(goal);

            if (goal && goal.status === PostStatus.Published) {
                this.sweetAlertService.success('Goal changes has been Published Successfully', '', 'success');
            }
    
            if (goal && goal.status === PostStatus.Unpublished) {
                this.sweetAlertService.success('Goal changes has been Unpublished Successfully', '', 'success');
            }

            this.goalService.redirectToGoalDetails(goal);
            return GoalUpdated({goal});
        })
    );


    @Effect()
    deleteGoal$ = this.actions$.pipe(
        ofType(DeleteGoal),
        map(action => action.goalId),
        switchMap((goalId: string) => {
            return this.goalService.deleteGoal(goalId).pipe(
                withLatestFrom(this.store.select(selectGoalsList)),
                map(([isDeleted, goals]) => {
                    if (isDeleted && goals && goals.length) {
                        let deletedGoalIndex = -1;
                        deletedGoalIndex = goals.findIndex((p) => p._id === goalId);
                        if (deletedGoalIndex > -1) {
                            goals.splice(deletedGoalIndex, 1);
                        }
                    }
                    return [...goals];
                })
            );
        }),
        map((goal: Goal[]) => {
            return GoalList({goal});
        }),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private goalService: GoalService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
