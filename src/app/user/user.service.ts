import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, concatMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Peer from 'peerjs';
import { appConstants } from '../shared/constants/app_constants';
import { CommentService } from '../shared/services/comment.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  peer = new BehaviorSubject<Peer>(null);
  userFields = `
    _id
    name
    email
    linkedin_url
    github_url
    stackoverflow_url
    location
    currentJobDetails {
      jobProfile
      companyName
      companyLocation
    }
    programming_languages
    avatar
    cover
    roles
    createdAt
    likeCount
    stripeId
    subscription {
      plan {
        nickname
        amount
        id
      }
      quantity
      id
      _id
      status
    }
    businessAreaInterests {
      name
      _id
    }
    leadershipAreaInterests {
      name
      _id
    }
    socialImpactInterests {
      name
      _id
    }
  `;

  updateUserQuery = gql`
  mutation updateUser($user: UserInput!) {
    updateUser(user: $user)
    {
      ${this.userFields}
    }
  }`;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private commentService: CommentService
  ) { }

  createUser(user): Observable<any> {
    return of([]);
  }

  updateUser(u: User) {
    console.log(u);

    return this.apollo.mutate(
      {
        mutation: this.updateUserQuery,
        variables: {
          user: u,
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((d: any) => {
        return d.data.updateUser;
      })
    );
  }

  getUserListWithBugFixesCount(): Observable<[]> {
    return this.apollo.query(
      {
        query: gql`
        query getUsersAndBugFixesCount {
          getUsersAndBugFixesCount {
            _id
            name
            productCount
          }
        }
      `
      }
    ).pipe(
      map((d: any) => {
        return d.data.getUsersAndBugFixesCount;
      })
    );
  }

  getUserById(userId: string): Observable<User> {
    return this.apollo.query(
      {
        query: gql`
        query getUserById($userId: String) {
          getUserById(userId: $userId) {
            ${this.userFields}
          }
        }
      `,
        variables: {
          userId
        }
      }
    ).pipe(
      map((d: any) => {
        return d.data.getUserById;
      }),
    );
  }

    /** On Adding Post Related to the company, listen Realtime  */
    onUsersPostChanges(userId) {
      const USER_POST_SUBSCRIPTION = gql`
      subscription onUsersPostChanges($userId: String) {
        onUsersPostChanges(userId: $userId){
          postUpdated {
            ...Post
          }
          postAdded {
            ...Post
          }
          postDeleted {
            _id
          }
        }
      }
      ${appConstants.postQuery}
      `;

      this.apollo.subscribe({
        query: USER_POST_SUBSCRIPTION,
        variables: { userId }
      }).pipe(
        tap((p: any) => {
          /** userPostList in the comment Service are mutable and hence we are mutating them here */
          const data = p.data.onUsersPostChanges;
          if (data && data.postAdded) {

            this.commentService.usersPostsList.unshift(data.postAdded);

          } else if (data && data.postUpdated) {

            const postToBeUpdated = this.commentService.usersPostsList.find(post => post._id === data.postUpdated._id);
            postToBeUpdated['description'] = data.postUpdated.description;
            postToBeUpdated['__edit'] = false;

          } else if (data && data.postDeleted) {

            const i = this.commentService.usersPostsList.findIndex(post => post._id === data.postDeleted._id);
            this.commentService.usersPostsList.splice(i, 1);

          }
        })
      ).subscribe();
    }

  getMyProfileInfo(userId: string): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
        query getMyProfileInfo($userId: String) {
          getMyProfileInfo(userId: $userId) {
            dreamJob {
              ...Post
            }
            businessAreaInterests {
              name
              _id
            }
            leadershipAreaInterests {
              name
              _id
            }
            socialImpactInterests {
              name
              _id
            }
          }
        }
        ${appConstants.postQuery}
      `,
        variables: {
          userId
        }
      }
    ).pipe(
      map((d: any) => {
        return d.data.getMyProfileInfo;
      })
    );
  }

  redirectToUserProfile(user: User) {
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'profile', user._id] } }]);
  }
}
