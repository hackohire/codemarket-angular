import { HelpQuery } from 'src/app/shared/models/help-query.model';

export interface HelpState {
    queries: HelpQuery[];
    selectedQuery: HelpQuery;
    allQueries: HelpQuery[];
}

export const initialHelpState: HelpState = {
    queries: null,
    selectedQuery: null,
    allQueries: null
};

