import { AppState } from '../state/app.state';
import { createSelector } from '@ngrx/store';
import { RequirementState } from '../state/requirement.state';

const selectRequirements = (state: AppState) => state.requirement;

export const selectRequirementsList = createSelector(
    selectRequirements,
    (state: RequirementState) => state.requirements
);

export const selectAllRequirementsList = createSelector(
    selectRequirements,
    (state: RequirementState) => state.allRequirements
);

export const selectSelectedRequirement = createSelector(
    selectRequirements,
    (state: RequirementState) => state.selectedRequirement
);
