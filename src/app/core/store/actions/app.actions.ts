import { Action, createAction, props } from '@ngrx/store';

export enum EPlatformActions {
    ResetPlatFormState = '[Platform] Reset State',
}

export const ResetPlatFormState = createAction(
    EPlatformActions.ResetPlatFormState
);
