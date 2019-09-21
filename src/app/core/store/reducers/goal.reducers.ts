import { initialGoalState, GoalState } from '../state/goal.state';
import { GoalAddedSuccessfully, GoalList, SetSelectedGoal, SetAllGoalsList } from '../actions/goal.actions';
import { on, createReducer, Action } from '@ngrx/store';


export const goalReducers = createReducer(
    initialGoalState,
    on(GoalAddedSuccessfully, (state, {goal}) => ({
        ...state,
        selectedGoal: goal
    })),


    on(GoalList, (state, {goal}) => ({
        ...state,
        goals: goal
    })),
    on(SetSelectedGoal, (state, {goal}) => ({
        ...state,
        selectedGoal: goal
    })),
    on(SetAllGoalsList, (state, {goal}) => ({
        ...state,
        allGoals: goal
    })),
);

export function reducer(state: GoalState | undefined, action: Action) {
    return goalReducers(state, action);
}
