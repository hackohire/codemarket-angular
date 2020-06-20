import { Injectable } from '@angular/core';
import { Email, Batch } from '../../shared/models/email.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { description } from '../../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Tweet } from '../models/tweet.model';

@Injectable({
    providedIn: 'root'
})

export class TweetService {
    tweetSchema: Tweet;

    tweetQuery  = gql`
    fragment Tweet on Tweet {
      id
      createdBy {
        name
        _id
      }
    }
  `;

  constructor(
    private apollo: Apollo
  ) { }

  tweet(tweet): Observable<any>{
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation tweet($tweet: TweetInput) {
            tweet(tweet: $tweet) {
              _id
            }
          }
        `,
        variables: {
          tweet
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.tweet;
      }),
    );
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