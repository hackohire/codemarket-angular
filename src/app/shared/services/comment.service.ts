import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { description } from 'src/app/shared/constants/fragments_constatnts';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable()
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
        avatar
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
          avatar
        }
        parentId
        referenceId
      }
      blockId
      blockSpecificComment
    }
    ${description}
  `;

  questionAndAnswerSchema = gql`
    fragment QuestionAndAnswer on QuestionAndAnswer {
      text {
        ...Description
      }
      _id
      type
      referenceId
      createdAt
      isQuestion
      isAnswer
      createdBy {
        _id
        name
        avatar
      }
      answers {
        text {
          ...Description
        }
        _id
        type
        referenceId
        questionId {
          _id
        }
        createdAt
        isAnswer
        createdBy {
          _id
          name
          avatar
        }
      }
      questionId {
        text {
          ...Description
        }
        _id
        type
        referenceId
        createdAt
        isQuestion
        createdBy {
          _id
          name
          avatar
        }
      }
    }
    ${description}
  `

  commentsQuery: QueryRef<any>;
  commentsList$ = new BehaviorSubject<Comment[]>(null);
  subscriptions$ = new Subscription();

  constructor(
    private apollo: Apollo,
  ) {
    console.log('instance Created')
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
          comment
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.addComment;
      }),
    );
  }

  onCommentAdded(postId, comments: any[]) {
    const COMMENTS_SUBSCRIPTION = gql`
    subscription onCommentAdded($postId: String) {
      onCommentAdded(postId: $postId){
        ...Comment
      }
    }
    ${this.commentSchema}
    `;

    this.subscriptions$.add(
      this.apollo.subscribe({
        query: COMMENTS_SUBSCRIPTION,
        variables: {
          postId
        }
      }).pipe(
        map((c: any) => {
          return c.data.onCommentAdded;
        }),
        tap((c: Comment[]) => {
          comments.push(c);
          this.commentsList$.next(comments);
        })
      ).subscribe()
    );
    // this.commentsQuery.subscribeToMore({
    //   document: COMMENTS_SUBSCRIPTION,
    //   updateQuery: (prev, {subscriptionData}) => {
    //     if (!subscriptionData.data) {
    //       return prev;
    //     }

    //     const newFeedItem = subscriptionData.data.onCommentAdded;

    //     const updated = Object.assign({}, {
    //       ...prev,
    //       getCommentsByReferenceId:  [newFeedItem, ...prev.getCommentsByReferenceId].slice()
    //     });
    //     return updated;
    //   }
    // })
  }

  getCommentsByReferenceId(referenceId) {
    // this.commentsQuery = this.apollo.watchQuery({
    //   query: gql`
    //   query getCommentsByReferenceId($referenceId: String) {
    //     getCommentsByReferenceId(referenceId: $referenceId) {
    //       ...Comment
    //     }
    //   }
    //   ${this.commentSchema}
    //   `,
    //   fetchPolicy: 'no-cache',
    //   variables: {
    //     referenceId
    //   }
    // });
    // return this.commentsQuery.valueChanges;

    this.subscriptions$.add(
      this.apollo.query(
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
            referenceId
          }
        }
      ).pipe(
        tap((p: any) => {
          const comments = p.data.getCommentsByReferenceId;
          this.commentsList$.next(comments);
          this.onCommentAdded(referenceId, comments);
          this.onCommentUpdated(referenceId, comments);
          this.onCommentDeleted(referenceId, comments);
        })
      ).subscribe()
    );
  }

  onCommentDeleted(postId, comments: Comment[]) {
    const COMMENT_DELETE_SUBSCRIPTION = gql`
    subscription onCommentDeleted($postId: String) {
      onCommentDeleted(postId: $postId) {
        referenceId
        _id
      }
    }
    `;

    this.subscriptions$.add(
      this.apollo.subscribe({
        query: COMMENT_DELETE_SUBSCRIPTION,
        variables: {
          postId
        }
      }).pipe(
        map((c: any) => {
          return c.data.onCommentDeleted;
        }),
        tap((c) => {
          const commentIndex = comments.findIndex(com => com._id === c._id);
          comments.splice(commentIndex, 1);
          this.commentsList$.next(comments);
        })
      ).subscribe()
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
        // fetchPolicy: 'no-cache',
        variables: {
          commentId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteComment;
      }),
    );
  }

  onCommentUpdated(postId, comments: Comment[]) {
    const COMMENT_UPDATE_SUBSCRIPTION = gql`
    subscription onCommentUpdated($postId: String) {
      onCommentUpdated(postId: $postId){
        ...Comment
      }
    }
    ${this.commentSchema}
    `;

    this.subscriptions$.add(
      this.apollo.subscribe({
        query: COMMENT_UPDATE_SUBSCRIPTION,
        variables: {
          postId
        }
      }).pipe(
        map((c: any) => {
          return c.data.onCommentUpdated;
        }),
        tap((c: Comment) => {
          const commentIndex = comments.slice().findIndex(com => com._id === c._id);
          comments[commentIndex]['text'] = c.text;
          this.commentsList$.next(comments);
        })
      ).subscribe()
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
          commentId,
          text
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.updateComment;
      }),
    );
  }

  /** Methods for Q&A */

  addQuestionOrAnswer(questionOrAnswer): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation addQuestionOrAnswer($questionOrAnswer: QuestionAndAnswerInput) {
            addQuestionOrAnswer(questionOrAnswer: $questionOrAnswer) {
              ...QuestionAndAnswer
            }
          }
          ${this.questionAndAnswerSchema}
        `,
        variables: {
          questionOrAnswer
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.addQuestionOrAnswer;
      }),
    );
  }


  getQuestionAndAnswersByReferenceId(referenceId): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query getQuestionAndAnswersByReferenceId($referenceId: String) {
            getQuestionAndAnswersByReferenceId(referenceId: $referenceId) {
              ...QuestionAndAnswer
            }
          }
          ${this.questionAndAnswerSchema}
        `,
        fetchPolicy: 'no-cache',
        variables: {
          referenceId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getQuestionAndAnswersByReferenceId;
      }),
    );
  }

  deleteQuestionOrAnswer(questionOrAnswerId): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query deleteQuestionOrAnswer($questionOrAnswerId: String) {
            deleteQuestionOrAnswer(questionOrAnswerId: $questionOrAnswerId)
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          questionOrAnswerId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteQuestionOrAnswer;
      }),
    );
  }

  updateQuestionOrAnswer(questionOrAnswerId, text): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateQuestionOrAnswer($questionOrAnswerId: String, $text: [InputdescriptionBlock]) {
            updateQuestionOrAnswer(questionOrAnswerId: $questionOrAnswerId, text: $text) {
                text {
                  ...Description
                }
            }
          }
          ${description}
        `,
        fetchPolicy: 'no-cache',
        variables: {
          questionOrAnswerId,
          text
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.updateQuestionOrAnswer;
      }),
    );
  }

  unsubscribe() {
    this.subscriptions$.unsubscribe();
    this.commentsList$.next([]);
  }
}
