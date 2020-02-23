import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { comment } from '../constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messages$ = new BehaviorSubject<{messages: any[], total: number}>({messages: [], total: 0});
  public messagesList$ = this.messages$.asObservable();

  constructor(
    private apollo: Apollo,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId,
    private readonly transferState: TransferState
  ) { }

  fetchLatestCommentsForTheUserEngaged(pageOptions, userId): void {
    /** Checks is transferState has passed the data & retrieves */
    const key = makeStateKey('messages');
    if (this.transferState.hasKey(key)) {
      let messages = this.transferState.get(key, null);
      let updatedMessages = this.messages$.getValue().messages.concat(messages);
      this.messages$.next({messages: updatedMessages, total: messages.total});
      this.transferState.remove(key);
    } else {
      this.apollo.query(
        {
          query: gql`
            query fetchLatestCommentsForTheUserEngaged($pageOptions: PageOptionsInput, $userId: ID) {
              fetchLatestCommentsForTheUserEngaged(pageOptions: $pageOptions, userId: $userId) {
                messages {
                  ...Comments
                }
                total
              }
            }
            ${comment}
          `,
          variables: {
            pageOptions: pageOptions ? pageOptions : {pageNumber: 1, limit: 10},
            userId
          },
          fetchPolicy: 'no-cache'
        }
      ).pipe(
        map((p: any) => {
          /** Sets the data to transferState */
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(key, p.data.fetchLatestCommentsForTheUserEngaged);
          }
          const messages = this.messages$.getValue().messages.concat(p.data.fetchLatestCommentsForTheUserEngaged.messages);
          this.messages$.next({messages, total: p.data.fetchLatestCommentsForTheUserEngaged.total});
        }),
      ).subscribe();
    }
  }

  addNewMessage(c) {
    c['__show'] = true;
    const messages = this.messages$.getValue();
    messages.messages.unshift(c);
    this.messages$.next(messages);
  }
}
