import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { productConstants } from 'src/app/shared/constants/product_constants';
import { Product } from 'src/app/shared/models/product.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs/internal/observable/of';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { withLatestFrom } from 'rxjs/operators';
import { description } from 'src/app/shared/constants/fragments_constatnts';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  commentSchema = gql`
    fragment Comment on Comment {
      text {
        ...Description
      }
      _id
      type
      referenceId
      parentId
      createdAt
      createdBy {
        _id
        name
      }
      children {
        _id
        text {
          ...Description
        }
        createdAt
        createdBy {
          _id
          name
        }
        parentId
        referenceId
      }
    }
    ${description}
  `;

  

  constructor(
    private apollo: Apollo,
  ) {
  }


  addComment(comment): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation addComment($comment: CommentInput) {
            addComment(comment: $comment) {
              ...Comment
            }
          }
          ${this.commentSchema}
        `,
        variables: {
          comment: comment
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.addComment;
      }),
    );
  }


  getCommentsByReferenceId(referenceId): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query getCommentsByReferenceId($referenceId: String) {
            getCommentsByReferenceId(referenceId: $referenceId) {
              ...Comment
            }
          }
          ${this.commentSchema}
        `,
        fetchPolicy: 'no-cache',
        variables: {
          referenceId: referenceId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCommentsByReferenceId;
      }),
    );
  }

  deleteComment(commentId): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query deleteComment($commentId: String) {
            deleteComment(commentId: $commentId)
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          commentId: commentId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteComment;
      }),
    );
  }

  updateComment(commentId, text): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateComment($commentId: String, $text: [InputdescriptionBlock]) {
            updateComment(commentId: $commentId, text: $text) {
              text {
                ...Description
              }
            }
          }
          ${description}
        `,
        fetchPolicy: 'no-cache',
        variables: {
          commentId: commentId,
          text: text
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.updateComment;
      }),
    );
  }
}
