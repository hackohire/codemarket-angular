import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { GoalState } from '../state/goal.state';

const selectGoals = (state: AppState) => state.goal;

export const selectGoalsList = createSelector(
    selectGoals,
    (state: GoalState) => state.goals
);

export const selectAllGoalsList = createSelector(
    selectGoals,
    (state: GoalState) => state.allGoals
);

export const selectSelectedGoal = createSelector(
    selectGoals,
    (state: GoalState) => state.selectedGoal
);
