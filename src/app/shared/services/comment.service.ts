import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
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
          comment
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
          referenceId
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
          commentId
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
}
