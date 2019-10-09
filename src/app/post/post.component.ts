import { Component, OnInit } from '@angular/core';
import { PostType } from '../shared/models/post-types.enum';
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

    /** Reload the route on every route click for any post type */
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }


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
    ];

    /** Filtering Routes Based On Post Type */
    this.currentRoutes = this.navLinks.filter(n => n.type === this.activatedRoute.snapshot.queryParams.type);
  }

  ngOnInit() {
  }
}
