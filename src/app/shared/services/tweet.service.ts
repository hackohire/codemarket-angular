import { Injectable } from '@angular/core';
import { Email, Batch } from '../../shared/models/email.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { description } from '../../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TweetService {
    tweetQuery  = gql`
    fragment Tweet on Tweet {
      _id
      type
      createdBy {
        name
        _id
      }
    }
  `;

  constructor(
    private apollo: Apollo
  ) { }

  addTweet(tweetId: string, desc: string){
    
  }

  getTweets(userId: string) {
    return this.apollo.query(
      {
        query: gql`
          query getTweets(user) {
            getTweets(user) {
              _id
              createdBy {
                _id
                name
              }
            }
          }
        `,
        variables: {
          userId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getTweets;
      }),
    );
  }

  getTweetList(): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query getTweetList() {
            getTweetList() {
              _id
              createdBy {
                _id
                name
              }
            }
          }
        `
      }
    ).pipe(
      map((p: any) => {
        return p.data.getTweetList;
      }),
    );
  }
}