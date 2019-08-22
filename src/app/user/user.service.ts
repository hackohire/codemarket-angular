import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  updateUserQuery = gql`
  mutation user($user: UserInput!) {
    updateUser(user: $user)
    {
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
      roles
    }
  }`;

  constructor(
    private apollo: Apollo
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
          'user': u,
        }
      }
    ).pipe(
      map((d: any) => {
        return d.data.updateUser;
      })
    );
  }
}
