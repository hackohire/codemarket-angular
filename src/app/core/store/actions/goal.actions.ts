import { createAction, props } from '@ngrx/store';
import { Goal } from 'src/app/shared/models/goal.model';

export enum EGoalActions {
    AddGoal = '[Goal] Add Goal',
    GoalAddedSuccessfully = '[Goal] Goal Added Successfully',

    UpdateGoal = '[Goal] Update Goal',
    GoalUpdated = '[Goal] Goal Updated',
    DeleteGoal = '[Goal] Delete Goal',

    GetAllGoals = '[Goal] Get All Goals', // List of All Goals in the platform
    GetGoalsByUserId = '[Goal] Get Goals By User Id',
    GetGoalById = '[Goal] Get Goal By Id',
    GoalList = '[Goal] GoalList', // List of Goals Created by LoggedIn User

    SetAllGoalsList = '[Goal] Set All Goals List', // Set the List of All Goals within the platform
    SetSelectedGoal = '[Goal] Select Goal'


}

export const AddGoal = createAction(
    EGoalActions.AddGoal,
    props<{goal: Goal}>()
);

export const GoalAddedSuccessfully = createAction(
    EGoalActions.GoalAddedSuccessfully,
    props<{goal: Goal}>()
);


export const GetGoalsByUserId = createAction(
    EGoalActions.GetGoalsByUserId,
    props<{userId: string, status: string}>()
);

export const GetGoalById = createAction(
    EGoalActions.GetGoalById,
    props<{goalId: string}>()
);

export const GoalList = createAction(
    EGoalActions.GoalList,
    props<{goal: Goal[]}>()
);

export const SetSelectedGoal = createAction(
    EGoalActions.SetSelectedGoal,
    props<{goal: Goal}>()
);

export const GetAllGoals = createAction(
    EGoalActions.GetAllGoals
);

export const SetAllGoalsList = createAction(
    EGoalActions.SetAllGoalsList,
    props<{goal: Goal[]}>()
);

export const UpdateGoal = createAction(
    EGoalActions.UpdateGoal,
    props<{goal: Goal}>()
);

export const GoalUpdated = createAction(
    EGoalActions.GoalUpdated,
    props<{goal: Goal}>()
);

export const DeleteGoal = createAction(
    EGoalActions.DeleteGoal,
    props<{goalId: string}>()
);

