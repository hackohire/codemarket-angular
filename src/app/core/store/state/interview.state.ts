import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Interview } from 'src/app/shared/models/interview.model';

export interface InterviewState {
    interviews: Interview[];
    selectedInterview: Interview;
    allInterviews: Interview[];
}

export const initialInterviewState: InterviewState = {
    interviews: null,
    selectedInterview: null,
    allInterviews: null
};

