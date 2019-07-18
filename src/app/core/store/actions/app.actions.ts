import { Action } from '@ngrx/store';

export enum EPlatformActions {
    ResetPlatFormState = '[Platform] Reset State',
}


export class ResetPlatFormState implements Action {
    public readonly type = EPlatformActions.ResetPlatFormState;
}


export type ApplicationActions = ResetPlatFormState;
