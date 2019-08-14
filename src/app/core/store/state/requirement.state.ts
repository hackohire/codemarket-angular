import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Requirement } from 'src/app/shared/models/requirement.model';

export interface RequirementState {
    requirements: Requirement[];
    selectedRequirement: Requirement;
    allRequirements: Requirement[];
}

export const initialRequirementState: RequirementState = {
    requirements: null,
    selectedRequirement: null,
    allRequirements: null
};

