import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PostComponent } from './post.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CompanyPostTypes, UserProfilePostTypes, PostType } from '../shared/models/post-types.enum';

const postRoutes: Routes = [
  {
    path: '',
    component: PostComponent,
    data: { noReuse: true },
    canLoad: [AuthGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'post-list',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'post-list',
      //   loadChildren: () => import('./post-list/post-list.module').then(module => module.PostListModule)
      // },
      {
        path: 'post-list',
        loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'dream-job-list',
        loadChildren: () => import('../dream-job/dreamjob-list/dreamjob-list.module').then(module => module.DreamjobListModule)
      },
      {
        path: 'add-goal',
        loadChildren: () => import('../goal/add-goal/add-goal.module').then(module => module.AddGoalModule),
      },
      {
        path: 'edit-goal/:goalId',
        loadChildren: () => import('../goal/add-goal/add-goal.module').then(module => module.AddGoalModule),
      },
      {
        path: 'add-design',
        loadChildren: () => import('../design/add-design/add-design.module').then(module => module.AddDesignModule),
      },
      {
        path: 'edit-design/:designId',
        loadChildren: () => import('../design/add-design/add-design.module').then(module => module.AddDesignModule),
      },
      {
        path: 'add-testing',
        loadChildren: () => import('../testing/add-testing/add-testing.module').then(module => module.AddTestingModule),
      },
      {
        path: 'edit-testing/:testingId',
        loadChildren: () => import('../testing/add-testing/add-testing.module').then(module => module.AddTestingModule),
      },
      {
        path: 'add-howtodoc',
        loadChildren: () => import('../howtodoc/add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
      },
      {
        path: 'edit-howtodoc/:howtodocId',
        loadChildren: () => import('../howtodoc/add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
      },
      {
        path: 'add-interview',
        loadChildren: () => import('../interview/add-interview/add-interview.module').then(module => module.AddInterviewModule),
      },
      {
        path: 'edit-interview/:interviewId',
        loadChildren: () => import('../interview/add-interview/add-interview.module').then(module => module.AddInterviewModule),
      },
      {
        path: 'add-requirement',
        loadChildren: () => import('../requirements/add-requirements/add-requirement.module').then(module => module.AddRequirementModule),
      },
      {
        path: 'edit-requirement/:requirementId',
        loadChildren: () => import('../requirements/add-requirements/add-requirement.module').then(module => module.AddRequirementModule),
      },
      {
        path: 'add-teamskill',
        loadChildren: () => import('../team-skill/add-teamskill/add-teamskill.module').then(module => module.AddTeamskillModule),
      },
      {
        path: 'edit-team-skill/:teamskillId',
        loadChildren: () => import('../team-skill/add-teamskill/add-teamskill.module').then(module => module.AddTeamskillModule),
      },
      {
        path: 'edit-help-request/:helpRequestId',
        loadChildren: () => import('../help/askforhelp/askforhelp.module').then(module => module.AskforhelpModule),
      },
      {
        path: 'edit-event/:eventId',
        loadChildren: () => import('../event/add-event/add-event.module').then(module => module.AddEventModule),
      },
      {
        path: 'add-dreamjob',
        loadChildren: () => import('../dream-job/add-dreamjob/add-dreamjob.module').then(module => module.AddDreamjobModule),
      },
      {
        path: 'edit-dream-job/:dreamjobId',
        loadChildren: () => import('../dream-job/add-dreamjob/add-dreamjob.module').then(module => module.AddDreamjobModule),
      },
      {
        path: 'add-job',
        loadChildren: () => import('../job/add-job/add-job.module').then(module => module.AddJobModule),
      },
      {
        path: 'edit-job/:jobId',
        loadChildren: () => import('../job/add-job/add-job.module').then(module => module.AddJobModule),
      },
      {
        path: 'add-career-coach',
        loadChildren: () => import('../career-coach/add-career-coach/add-career-coach.module').then(module => module.AddCareerCoachModule),
      },
      {
        path: 'edit-career-coach/:careerCoachId',
        loadChildren: () => import('../career-coach/add-career-coach/add-career-coach.module').then(module => module.AddCareerCoachModule),
      },
      {
        path: 'add-business-coach',
        loadChildren: () => import('../business-coach/add-business-coach/add-business-coach.module')
          .then(module => module.AddBusinessCoachModule),
      },
      {
        path: 'edit-business-coach/:businessCoachId',
        loadChildren: () => import('../business-coach/add-business-coach/add-business-coach.module')
          .then(module => module.AddBusinessCoachModule),
      },
      {
        path: 'add-capital-funding',
        loadChildren: () => import('../capital-funding/add-capital-funding/add-capital-funding.module')
          .then(module => module.AddCapitalFundingModule),
      },
      {
        path: 'edit-capital-funding/:capitalFundingId',
        loadChildren: () => import('../capital-funding/add-capital-funding/add-capital-funding.module')
          .then(module => module.AddCapitalFundingModule),
      },
      {
        path: 'add-hiring-process',
        loadChildren: () => import('../hiring-process/add-hiring-process/add-hiring-process.module')
          .then(module => module.AddHiringProcessModule),
      },
      {
        path: 'edit-hiring-process/:hiringProcessId',
        loadChildren: () => import('../hiring-process/add-hiring-process/add-hiring-process.module')
          .then(module => module.AddHiringProcessModule),
      },
      /* add two routes blocks */
      {
        path: `add-${CompanyPostTypes.BusinessChallenge}`,
        loadChildren: () => import('../business-challenge/add-business-challenge/add-business-challenge.module')
          .then(module => module.AddBusinessChallengeModule),
      },
      {
        path: `edit-${CompanyPostTypes.BusinessChallenge}/:postId`,
        loadChildren: () => import('../business-challenge/add-business-challenge/add-business-challenge.module')
          .then(module => module.AddBusinessChallengeModule),
      },

      /** Add company goal */
      {
        path: `add-${CompanyPostTypes.BusinessGoal}`,
        loadChildren: () => import('../business-goal/add-business-goal/add-business-goal.module')
          .then(module => module.AddBusinessGoalModule),
      },
      {
        path: `edit-${CompanyPostTypes.BusinessGoal}/:postId`,
        loadChildren: () => import('../business-goal/add-business-goal/add-business-goal.module')
          .then(module => module.AddBusinessGoalModule),
      },

      /** Add Company Marketing Challege */
      {
        path: `add-${CompanyPostTypes.MarketingChallenge}`,
        loadChildren: () => import('../marketing-challenge/add-marketing-challenge/add-marketing-challenge.module')
          .then(module => module.AddMarketingChallengeModule),
      },
      {
        path: `edit-${CompanyPostTypes.MarketingChallenge}/:postId`,
        loadChildren: () => import('../marketing-challenge/add-marketing-challenge/add-marketing-challenge.module')
          .then(module => module.AddMarketingChallengeModule),
      },

      /** Add Company Sales Challege */
      {
        path: `add-${CompanyPostTypes.SalesChallenge}`,
        loadChildren: () => import('../sales-challenge/add-sales-challenge/add-sales-challenge.module')
          .then(module => module.AddSalesChallengeModule),
      },
      {
        path: `edit-${CompanyPostTypes.SalesChallenge}/:postId`,
        loadChildren: () => import('../sales-challenge/add-sales-challenge/add-sales-challenge.module')
          .then(module => module.AddSalesChallengeModule),
      },

      /** Add Company Technical Challege */
      {
        path: `add-${CompanyPostTypes.TechnicalChallenge}`,
        loadChildren: () => import('../technical-challenge/add-technical-challenge/add-technical-challenge.module')
          .then(module => module.AddTechnicalChallengeModule),
      },
      {
        path: `edit-${CompanyPostTypes.TechnicalChallenge}/:postId`,
        loadChildren: () => import('../technical-challenge/add-technical-challenge/add-technical-challenge.module')
          .then(module => module.AddTechnicalChallengeModule),
      },


      /** Add Company Team Challege */
      {
        path: `add-${CompanyPostTypes.TeamChallenge}`,
        loadChildren: () => import('../team-challenge/add-team-challenge/add-team-challenge.module')
          .then(module => module.AddTeamChallengeModule),
      },
      {
        path: `edit-${CompanyPostTypes.TeamChallenge}/:postId`,
        loadChildren: () => import('../team-challenge/add-team-challenge/add-team-challenge.module')
          .then(module => module.AddTeamChallengeModule),
      },

      /** Add Company Sale Goal */
      {
        path: `add-${CompanyPostTypes.SalesGoal}`,
        loadChildren: () => import('../sales-goal/add-sales-goal/add-sales-goal.module')
          .then(module => module.AddSalesGoalModule),
      },
      {
        path: `edit-${CompanyPostTypes.SalesGoal}/:postId`,
        loadChildren: () => import('../sales-goal/add-sales-goal/add-sales-goal.module')
          .then(module => module.AddSalesGoalModule),
      },

      /** Add Company Marketing Goal */
      {
        path: `add-${CompanyPostTypes.MarketingGoal}`,
        loadChildren: () => import('../marketing-goal/add-marketing-goal/add-marketing-goal.module')
          .then(module => module.AddMarketingGoalModule),
      },
      {
        path: `edit-${CompanyPostTypes.MarketingGoal}/:postId`,
        loadChildren: () => import('../marketing-goal/add-marketing-goal/add-marketing-goal.module')
          .then(module => module.AddMarketingGoalModule),
      },

      /** Add Company Technical Goal */
      {
        path: `add-${CompanyPostTypes.TechnicalGoal}`,
        loadChildren: () => import('../technical-goal/add-technical-goal/add-technical-goal.module')
          .then(module => module.AddTechnicalGoalModule),
      },
      {
        path: `edit-${CompanyPostTypes.TechnicalGoal}/:postId`,
        loadChildren: () => import('../technical-goal/add-technical-goal/add-technical-goal.module')
          .then(module => module.AddTechnicalGoalModule),
      },

      /** Add Company Team Goal */
      {
        path: `add-${CompanyPostTypes.TeamGoal}`,
        loadChildren: () => import('../team-goal/add-team-goal/add-team-goal.module')
          .then(module => module.AddTeamGoalModule),
      },
      {
        path: `edit-${CompanyPostTypes.TeamGoal}/:postId`,
        loadChildren: () => import('../team-goal/add-team-goal/add-team-goal.module')
          .then(module => module.AddTeamGoalModule),
      },

      /** Add Company Mission */
      {
        path: `add-${CompanyPostTypes.Mission}`,
        loadChildren: () => import('../mission/add-mission/add-mission.module')
          .then(module => module.AddMissionModule),
      },
      {
        path: `edit-${CompanyPostTypes.Mission}/:postId`,
        loadChildren: () => import('../mission/add-mission/add-mission.module')
          .then(module => module.AddMissionModule),
      },

      /** Add Company Post */
      {
        path: `add-${CompanyPostTypes.CompanyPost}`,
        loadChildren: () => import('../company-post/add-company-post/add-company-post.module')
          .then(module => module.AddCompanyPostModule),
      },
      {
        path: `edit-${CompanyPostTypes.CompanyPost}/:postId`,
        loadChildren: () => import('../company-post/add-company-post/add-company-post.module')
          .then(module => module.AddCompanyPostModule),
      },

      /** Add User Startup Goal */
      {
        path: `add-${UserProfilePostTypes.StartupGoal}`,
        loadChildren: () => import('../startup-goal/add-startup-goal/add-startup-goal.module')
          .then(module => module.AddStartupGoalModule),
      },
      {
        path: `edit-${UserProfilePostTypes.StartupGoal}/:postId`,
        loadChildren: () => import('../startup-goal/add-startup-goal/add-startup-goal.module')
          .then(module => module.AddStartupGoalModule),
      },

      /** Add User Social Impact Goal */
      {
        path: `add-${UserProfilePostTypes.SocialImpactGoal}`,
        loadChildren: () => import('../social-impact-goal/add-social-impact-goal/add-social-impact-goal.module')
          .then(module => module.AddSocialImpactGoalModule),
      },
      {
        path: `edit-${UserProfilePostTypes.SocialImpactGoal}/:postId`,
        loadChildren: () => import('../social-impact-goal/add-social-impact-goal/add-social-impact-goal.module')
          .then(module => module.AddSocialImpactGoalModule)
      },

      /** Add User Leadership challenge */
      {
        path: `add-${UserProfilePostTypes.LeadershipChallenge}`,
        loadChildren: () => import('../leadership-challenge/add-leadership-challenge/add-leadership-challenge.module')
          .then(module => module.AddLeadershipChallengeModule),
      },
      {
        path: `edit-${UserProfilePostTypes.LeadershipChallenge}/:postId`,
        loadChildren: () => import('../leadership-challenge/add-leadership-challenge/add-leadership-challenge.module')
          .then(module => module.AddLeadershipChallengeModule),
      },

      /** Add User Stress Management */
      {
        path: `add-${UserProfilePostTypes.StressManagement}`,
        loadChildren: () => import('../stress-management/add-stress-management/add-stress-management.module')
          .then(module => module.AddStressManagementModule),
      },
      {
        path: `edit-${UserProfilePostTypes.StressManagement}/:postId`,
        loadChildren: () => import('../stress-management/add-stress-management/add-stress-management.module')
          .then(module => module.AddStressManagementModule),
      },

      /** Add Assignment */
      {
        path: `add-${PostType.Assignment}`,
        loadChildren: () => import('../assignment/add-assignment/add-assignment.module')
          .then(module => module.AddAssignmentModule),
      },
      {
        path: `edit-${PostType.Assignment}/:postId`,
        loadChildren: () => import('../assignment/add-assignment/add-assignment.module')
          .then(module => module.AddAssignmentModule),
      },

      /** SEND EMAIL */
      {
        path: `send-${PostType.Email}`,
        loadChildren: () => import('../email/send-email/send-email.module')
          .then(module => module.SendEmailModule),
      },
    ],
    // runGuardsAndResolvers: 'always',
  },
];


@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(postRoutes)
  ]
})
export class PostModule { }
