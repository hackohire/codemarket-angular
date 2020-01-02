import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { description, comment } from 'src/app/shared/constants/fragments_constatnts';
import { tap, take } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Comment } from '../models/comment.model';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { appConstants } from '../constants/app_constants';
import { PostService } from './post.service';

@Injectable()
export class CommentService {

  commentSchema = comment;

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
    private toastrService: ToastrService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private postService: PostService
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

  onCommentAdded(post, comments: Comment[]) {
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
          postId: post._id
        }
      }).pipe(
        map((c: any) => {
          return c.data.onCommentAdded;
        }),
        tap((c: Comment) => {

          if (c.parentId) {
            const commentIndex = comments.slice().findIndex(com => com._id === c.parentId);
            comments[commentIndex]['children'].push(c);
          } else {
            comments.push(c);
          }
          /** Audio Notification */
          // var audio = new Audio(appConstants.Notification);
          // audio.play();

          /** Tostr Notification */
          // this.openToastrNotification(post, c)

          this.commentsList$.next(comments);
        })
      ).subscribe()
    );
  }

  openToastrNotification(post, c, rediect = true) {
    const message = c.parentId ? 'has reaplied to a comment on this post' : 'has commented on this post'

    this.subscriptions$.add(
      this.toastrService.info(
        `<b>${c.createdBy.name}</b> ${message}  <br>
        <u>View</u>
        `
      ).onTap
      .pipe(take(1))
      .subscribe(() => {
        if (rediect) {
          this.postService.redirectToPostDetails(post);
        }       
        this.scrollToComment(post.description, c);
      })
    );
  }

  scrollToComment(blocks: [], c: Comment) {
    /** If block specific comment, open the comment section for that block first */
    if (c.blockSpecificComment) {
      const b: any = blocks.find((b: any) => b._id === c.blockId);
      b['__show'] = true;
    }

    /** If block specific comment, wait for half second to open the comment section for that block first */
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        let el = this.document.getElementById(`${c._id}`);
        el.scrollIntoView({block: 'center', behavior: 'smooth', inline: 'center'}); /** scroll to the element upto the center */
        el.style.outline = '2px solid #00aeef'; /** Highlighting the element */
      }, c.blockSpecificComment ? 500 : 0);
    }
  }

  getCommentsByReferenceId(post, commentId = '') {
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
            referenceId: post._id
          }
        }
      ).pipe(
        tap((p: any) => {
          const comments = p.data.getCommentsByReferenceId;
          this.commentsList$.next(comments);
          this.onCommentAdded(post, comments);
          this.onCommentUpdated(post, comments);
          this.onCommentDeleted(post, comments);

          /** If comment Id is passed scroll down to the comment */
          if (comments && comments.length && commentId) {
            const comment = comments.find(c => c._id === commentId)
            this.scrollToComment(post.description, comment);
          }
        })
      ).subscribe()
    );
  }

  onCommentDeleted(post, comments: Comment[]) {
    const COMMENT_DELETE_SUBSCRIPTION = gql`
    subscription onCommentDeleted($postId: String) {
      onCommentDeleted(postId: $postId) {
        referenceId
        parentId
        _id
      }
    }
    `;

    this.subscriptions$.add(
      this.apollo.subscribe({
        query: COMMENT_DELETE_SUBSCRIPTION,
        variables: {
          postId: post._id
        }
      }).pipe(
        map((c: any) => {
          return c.data.onCommentDeleted;
        }),
        tap((c: Comment) => {
          if (c.parentId) {
            const parentCommentIndex = comments.findIndex(com => com._id === c.parentId);
            const deletedChildCommentIndex = comments[parentCommentIndex]['children'].findIndex(com => com._id === c._id);
            comments[parentCommentIndex]['children'].splice(deletedChildCommentIndex, 1);
          } else {
            const commentIndex = comments.findIndex(com => com._id === c._id);
            comments.splice(commentIndex, 1);
          }
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

  onCommentUpdated(post, comments: Comment[]) {
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
          postId: post._id
        }
      }).pipe(
        map((c: any) => {
          return c.data.onCommentUpdated;
        }),
        tap((c: Comment) => {
          if (c.parentId) {
            const parentCommentIndex = comments.findIndex(com => com._id === c.parentId);
            const deletedChildCommentIndex = comments[parentCommentIndex]['children'].findIndex(com => com._id === c._id);
            comments[parentCommentIndex]['children'][deletedChildCommentIndex]['text'] = c.text;
          } else {
            const commentIndex = comments.slice().findIndex(com => com._id === c._id);
            comments[commentIndex]['text'] = c.text;
          }
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
