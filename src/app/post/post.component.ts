import { Component, OnInit } from '@angular/core';
import { PostType, CompanyPostTypes, UserProfilePostTypes } from '../shared/models/post-types.enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  navLinks = [];
  currentRoutes = [];
  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    this.navLinks = [

      /** Interview */
      {
        path: 'post-list',
        label: 'Interview List',
        queryParams: { type: PostType.Interview, all: false },
        type: PostType.Interview
      },
      {
        path: 'add-interview',
        label: 'Add Interview',
        queryParams: { type: PostType.Interview },
        type: PostType.Interview
      },

      /** Requirements */
      {
        path: 'post-list',
        label: 'Requirements List',
        queryParams: { type: PostType.Requirement, all: false },
        type: PostType.Requirement
      },
      {
        path: 'add-requirement',
        label: 'Add Requirement',
        queryParams: { type: PostType.Requirement },
        type: PostType.Requirement
      },

      /** Goal */
      {
        path: 'post-list',
        label: 'Goal List',
        queryParams: { type: PostType.Goal, all: false },
        type: PostType.Goal
      },
      {
        path: 'add-goal',
        label: 'Add Goal',
        queryParams: { type: PostType.Goal },
        type: PostType.Goal
      },

      /** Design */
      {
        path: 'post-list',
        label: 'Design List',
        queryParams: { type: PostType.Design, all: false },
        type: PostType.Design
      },
      {
        path: 'add-design',
        label: 'Add Design',
        queryParams: { type: PostType.Design },
        type: PostType.Design
      },

      /** Testing */
      {
        path: 'post-list',
        label: 'Testing Report List',
        queryParams: { type: PostType.Testing, all: false },
        type: PostType.Testing
      },
      {
        path: 'add-testing',
        label: 'Add Testing Report',
        queryParams: { type: PostType.Testing },
        type: PostType.Testing,
      },

      /** Howtodoc */
      {
        path: 'howtodoc-list',
        label: 'How-to-Guide List',
        queryParams: { type: PostType.Howtodoc, all: false },
        type: PostType.Howtodoc
      },
      {
        path: 'add-howtodoc',
        label: 'Add How-to-Guide',
        queryParams: { type: PostType.Howtodoc },
        type: PostType.Howtodoc
      },

      /** Team Skill */
      {
        path: 'post-list',
        label: 'Teamskill List',
        queryParams: { type: PostType.Teamskill, all: false },
        type: PostType.Teamskill
      },
      {
        path: 'add-teamskill',
        label: 'Add Teamskill',
        queryParams: { type: PostType.Teamskill },
        type: PostType.Teamskill
      },

      /** Dream job */
      {
        path: 'dream-job-list',
        label: 'Dream Job List',
        queryParams: { type: PostType.Dreamjob, all: false },
        type: PostType.Dreamjob
      },
      {
        path: 'add-dreamjob',
        label: 'Add Dream Job',
        queryParams: { type: PostType.Dreamjob },
        type: PostType.Dreamjob
      },

      /** Job */
      {
        path: 'post-list',
        label: 'Jobs List',
        queryParams: { type: PostType.Job, all: false },
        type: PostType.Job
      },
      {
        path: 'add-job',
        label: 'Add Job',
        queryParams: { type: PostType.Job },
        type: PostType.Job
      },

      /** COMPANY POST TYPES */

      /** Business Challenge */
      {
        path: 'post-list',
        label: 'Business Challenges List',
        queryParams: { type: CompanyPostTypes.BusinessChallenge, all: false },
        type: CompanyPostTypes.BusinessChallenge
      },
      {
        path: 'add-' + CompanyPostTypes.BusinessChallenge,
        label: 'Add ' + CompanyPostTypes.BusinessChallenge,
        queryParams: { type: CompanyPostTypes.BusinessChallenge },
        type: CompanyPostTypes.BusinessChallenge
      },

      /** Business Goal */
      {
        path: 'post-list',
        label: 'Business Goals List',
        queryParams: { type: CompanyPostTypes.BusinessGoal, all: false },
        type: CompanyPostTypes.BusinessGoal
      },
      {
        path: 'add-' + CompanyPostTypes.BusinessGoal,
        label: 'Add ' + CompanyPostTypes.BusinessGoal,
        queryParams: { type: CompanyPostTypes.BusinessGoal },
        type: CompanyPostTypes.BusinessGoal
      },

      /** Sales Challenge */
      {
        path: 'post-list',
        label: 'Sales Challenge List',
        queryParams: { type: CompanyPostTypes.SalesChallenge, all: false },
        type: CompanyPostTypes.SalesChallenge
      },
      {
        path: 'add-' + CompanyPostTypes.SalesChallenge,
        label: 'Add ' + CompanyPostTypes.SalesChallenge,
        queryParams: { type: CompanyPostTypes.SalesChallenge },
        type: CompanyPostTypes.SalesChallenge
      },

      /** Marketing Challenge */
      {
        path: 'post-list',
        label: 'Marketing Challenge List',
        queryParams: { type: CompanyPostTypes.MarketingChallenge, all: false },
        type: CompanyPostTypes.MarketingChallenge
      },
      {
        path: 'add-' + CompanyPostTypes.MarketingChallenge,
        label: 'Add ' + CompanyPostTypes.MarketingChallenge,
        queryParams: { type: CompanyPostTypes.MarketingChallenge },
        type: CompanyPostTypes.MarketingChallenge
      },

      /** Technical Challenge */
      {
        path: 'post-list',
        label: 'Technical Challenge List',
        queryParams: { type: CompanyPostTypes.TechnicalChallenge, all: false },
        type: CompanyPostTypes.TechnicalChallenge
      },
      {
        path: 'add-' + CompanyPostTypes.TechnicalChallenge,
        label: 'Add ' + CompanyPostTypes.TechnicalChallenge,
        queryParams: { type: CompanyPostTypes.TechnicalChallenge },
        type: CompanyPostTypes.TechnicalChallenge
      },

      /** Team Challenge */
      {
        path: 'post-list',
        label: 'Team Challenge List',
        queryParams: { type: CompanyPostTypes.TeamChallenge, all: false },
        type: CompanyPostTypes.TeamChallenge
      },
      {
        path: 'add-' + CompanyPostTypes.TeamChallenge,
        label: 'Add ' + CompanyPostTypes.TeamChallenge,
        queryParams: { type: CompanyPostTypes.TeamChallenge },
        type: CompanyPostTypes.TeamChallenge
      },

      /** Sales Goal */
      {
        path: 'post-list',
        label: 'Sales Goal List',
        queryParams: { type: CompanyPostTypes.SalesGoal, all: false },
        type: CompanyPostTypes.SalesGoal
      },
      {
        path: 'add-' + CompanyPostTypes.SalesGoal,
        label: 'Add ' + CompanyPostTypes.SalesGoal,
        queryParams: { type: CompanyPostTypes.SalesGoal },
        type: CompanyPostTypes.SalesGoal
      },

      /** Marketing Goal */
      {
        path: 'post-list',
        label: 'Marketing Goal List',
        queryParams: { type: CompanyPostTypes.MarketingGoal, all: false },
        type: CompanyPostTypes.MarketingGoal
      },
      {
        path: 'add-' + CompanyPostTypes.MarketingGoal,
        label: 'Add ' + CompanyPostTypes.MarketingGoal,
        queryParams: { type: CompanyPostTypes.MarketingGoal },
        type: CompanyPostTypes.MarketingGoal
      },

      /** Technical Goal */
      {
        path: 'post-list',
        label: 'Technical Goal List',
        queryParams: { type: CompanyPostTypes.TechnicalGoal, all: false },
        type: CompanyPostTypes.TechnicalGoal
      },
      {
        path: 'add-' + CompanyPostTypes.TechnicalGoal,
        label: 'Add ' + CompanyPostTypes.TechnicalGoal,
        queryParams: { type: CompanyPostTypes.TechnicalGoal },
        type: CompanyPostTypes.TechnicalGoal
      },

      /** Team Goal */
      {
        path: 'post-list',
        label: 'Team Goal List',
        queryParams: { type: CompanyPostTypes.TeamGoal, all: false },
        type: CompanyPostTypes.TeamGoal
      },
      {
        path: 'add-' + CompanyPostTypes.TeamGoal,
        label: 'Add ' + CompanyPostTypes.TeamGoal,
        queryParams: { type: CompanyPostTypes.TeamGoal },
        type: CompanyPostTypes.TeamGoal
      },

      /** Mission */
      {
        path: 'post-list',
        label: 'Mission List',
        queryParams: { type: CompanyPostTypes.Mission, all: false },
        type: CompanyPostTypes.Mission
      },
      {
        path: 'add-' + CompanyPostTypes.Mission,
        label: 'Add ' + CompanyPostTypes.Mission,
        queryParams: { type: CompanyPostTypes.Mission },
        type: CompanyPostTypes.Mission
      },

       /** Company Post */
       {
        path: 'post-list',
        label: 'Company Post List',
        queryParams: { type: CompanyPostTypes.CompanyPost, all: false },
        type: CompanyPostTypes.CompanyPost
      },
      {
        path: 'add-' + CompanyPostTypes.CompanyPost,
        label: 'Add ' + CompanyPostTypes.CompanyPost,
        queryParams: { type: CompanyPostTypes.CompanyPost },
        type: CompanyPostTypes.CompanyPost
      },

      /** Customer Template */
      {
        path: 'post-list',
        label: 'Customer Template List',
        queryParams: { type: CompanyPostTypes.CustomerTemplate, all: false },
        type: CompanyPostTypes.CustomerTemplate
      },
      {
        path: 'add-' + CompanyPostTypes.CustomerTemplate,
        label: 'Add ' + CompanyPostTypes.CustomerTemplate,
        queryParams: { type: CompanyPostTypes.CustomerTemplate },
        type: CompanyPostTypes.CustomerTemplate
      },

      /** User Startup Goal */
      {
        path: 'post-list',
        label: 'Startup Goal List',
        queryParams: { type: UserProfilePostTypes.StartupGoal, all: false },
        type: UserProfilePostTypes.StartupGoal
      },
      {
        path: 'add-' + UserProfilePostTypes.StartupGoal,
        label: 'Add ' + UserProfilePostTypes.StartupGoal,
        queryParams: { type: UserProfilePostTypes.StartupGoal },
        type: UserProfilePostTypes.StartupGoal
      },

      /** User Social Impact Goal */
      {
        path: 'post-list',
        label: 'Social Impact Goal List',
        queryParams: { type: UserProfilePostTypes.SocialImpactGoal, all: false },
        type: UserProfilePostTypes.SocialImpactGoal
      },
      {
        path: 'add-' + UserProfilePostTypes.SocialImpactGoal,
        label: 'Add ' + UserProfilePostTypes.SocialImpactGoal,
        queryParams: { type: UserProfilePostTypes.SocialImpactGoal },
        type: UserProfilePostTypes.SocialImpactGoal
      },

      /** User Leadership challenge */
      {
        path: 'post-list',
        label: 'Leadership Challenge List',
        queryParams: { type: UserProfilePostTypes.LeadershipChallenge, all: false },
        type: UserProfilePostTypes.LeadershipChallenge
      },
      {
        path: 'add-' + UserProfilePostTypes.LeadershipChallenge,
        label: 'Add ' + UserProfilePostTypes.LeadershipChallenge,
        queryParams: { type: UserProfilePostTypes.LeadershipChallenge },
        type: UserProfilePostTypes.LeadershipChallenge
      },

      /** User Stress Management */
      {
        path: 'post-list',
        label: 'Stress Management List',
        queryParams: { type: UserProfilePostTypes.StressManagement, all: false },
        type: UserProfilePostTypes.StressManagement
      },
      {
        path: 'add-' + UserProfilePostTypes.StressManagement,
        label: 'Add ' + UserProfilePostTypes.StressManagement,
        queryParams: { type: UserProfilePostTypes.StressManagement },
        type: UserProfilePostTypes.StressManagement
      },
      /** COMPANY POST TYPES ENDS HERE */


      /** Posts Related to User Profile */


      /** Posts Related to User Profile ENDS HERE */
    ];

    /** Filtering Routes Based On Post Type */
    this.currentRoutes = this.navLinks.filter(n => n.type === this.activatedRoute.snapshot.queryParams.type);
  }

  ngOnInit() {
  }
}
