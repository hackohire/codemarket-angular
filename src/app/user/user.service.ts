import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, } from 'rxjs/operators';
import { Router } from '@angular/router';
import Peer from 'peerjs';
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
    slug
    currentJobDetails {
      jobProfile {
        name
        _id
        type
      }
      company {
        name
        _id
      }
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
    return this.apollo.mutate(
      {
        mutation: gql`
        mutation createUser($user: UserInput!) {
          createUser(user: $user) {
            name
            email
            _id
          }
        }
        `,
        variables: {
          user
        }
      }
    ).pipe(
      map((d: any) => {
        return d.data.createUser;
      })
    );
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

  redirectToUserProfile(user: User) {
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'profile', user._id] } }]);
  }
}
