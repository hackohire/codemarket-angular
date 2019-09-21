import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Goal } from 'src/app/shared/models/goal.model';

export interface GoalState {
    goals: Goal[];
    selectedGoal: Goal;
    allGoals: Goal[];
}

export const initialGoalState: GoalState = {
    goals: null,
    selectedGoal: null,
    allGoals: null
};

