import { PostType } from '../models/post-types.enum';

export const appConstants = {

    icons : {
        [PostType.Product]: 'lightbulb-dollar',
        [PostType.Interview]: 'user-tie',
        [PostType.Requirement]: 'file-alt',
        [PostType.HelpRequest]: 'question-circle',
        [PostType.Howtodoc]: 'file-exclamation',
        [PostType.Testing]: 'tasks',
        [PostType.Teamskill]: 'users-crown',
        [PostType.Design]: 'marker',
        [PostType.Event]: 'calendar-plus',
        [PostType.Goal]: 'bullseye-arrow',
        [PostType.Dreamjob]: 'briefcase'
    }
};
