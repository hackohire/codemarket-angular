import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../core/store/state/app.state';
import { Post } from '../models/post.model';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs/observable/of';
import { PostType } from '../models/post-types.enum';
import { appConstants } from '../constants/app_constants';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { isPlatformServer } from '@angular/common';
import { comment, description } from '../constants/fragments_constatnts';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postFields = appConstants.postQuery;
  contentFromAnotherArticle = new BehaviorSubject(null);
  constructor(
    private apollo: Apollo,
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId,
    private router: Router,
    private authService: AuthService,
    private readonly transferState: TransferState
  ) { }


  getPostsByUserIdAndType(userId: string, status: string, postType: string, pageOptions = { pageNumber: 0, limit: 0 }): Observable<{ posts: Post[], total: number }> {
    return this.apollo.query(
      {
        query: gql`
          query getPostsByUserIdAndType($userId: String, $status: String, $postType: String, $pageOptions: PageOptionsInput) {
            getPostsByUserIdAndType(userId: $userId, status: $status, postType: $postType, pageOptions: $pageOptions) {
              posts {
                ...Post
              }
              total
            }
          }
          ${this.postFields}
        `,
        variables: {
          userId,
          status,
          postType,
          pageOptions
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getPostsByUserIdAndType;
      }),
    );
  }


  getPostsByType(postTye: string): Observable<Post[]> {
    return this.apollo.query(
      {
        query: gql`
          query getPostsByType($postTye: String) {
            getPostsByType(postType: $postTye) {
              ...Post
            }
          }
          ${this.postFields}
        `,
        variables: {
          postTye
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getPostsByType;
      }),
    );
  }

  getPostById(PostId: string): Observable<Post> {
    /** Checks is transferState has passed the data & retrieves */
    const key = makeStateKey(PostId);
    if (this.transferState.hasKey(key)) {
      const post = this.transferState.get(key, null);
      this.transferState.remove(key);
      return of(post);
    }
    return this.apollo.query(
      {
        query: gql`
          query getPostById($PostId: String) {
            getPostById(postId: $PostId) {
              ...Post
            }
          }
          ${this.postFields}
        `,
        variables: {
          PostId
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        /** Sets the data to transferState */
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(key, p.data.getPostById);
        }
        return p.data.getPostById;
      }),
    );
  }

  addPost(post: Post): Observable<Post> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addPost($post: PostInput) {
          addPost(post: $post) {
            ...Post
          }
        }
        ${this.postFields}
      `,
      variables: {
        post
      }
    }).pipe(
      map((q: any) => q.data.addPost)
    );
  }

  updatePost(post: Post, updatedBy = null): Observable<Post> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updatePost($post: PostInput, $updatedBy: UserInput) {
            updatePost(post: $post, updatedBy: $updatedBy) {
              ...Post
            }
          }
          ${this.postFields}
        `,
        variables: {
          post,
          updatedBy
        }
      }
    ).pipe(
      map((p: any) => p.data.updatePost),
    );
  }

  deletePost(postId: string, deletedBy = null): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deletePost($postId: String, $deletedBy: UserInput) {
            deletePost(postId: $postId, deletedBy: $deletedBy)
          }
        `,
        variables: {
          postId,
          deletedBy
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deletePost;
      }),
    );
  }

  getAllPosts(pageOptions, type, reference = null, companyId = '', connectedWithUser = '', createdBy = ''): Observable<{ posts: Post[], total: number }> {
    return this.apollo.query(
      {
        query: gql`
          query getAllPosts($pageOptions: PageOptionsInput, $type: String, $reference: ReferenceObject, $companyId: String, $connectedWithUser: String, $createdBy: String) {
            getAllPosts(pageOptions: $pageOptions, type: $type, reference: $reference, companyId: $companyId, connectedWithUser: $connectedWithUser, createdBy: $createdBy) {
              posts {
                ...Post
              }
              total
            }
          }
          ${appConstants.postQuery}
        `,
        variables: {
          pageOptions,
          type: type ? type : '',
          reference: reference ? reference : null,
          companyId,
          connectedWithUser,
          createdBy
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllPosts;
      }),
    );
  }

  getCountOfAllPost(userId: string, companyId: string, reference: any): Observable<any> {
    return this.apollo.query({
      query : gql`
        query getCountOfAllPost($userId: String, $companyId: String, $reference: ReferenceObject) {
          getCountOfAllPost(userId: $userId, companyId: $companyId, reference: $reference) {
            _id
            count
          }
        }
      `,
      variables: {
        userId: userId ? userId : null,
        companyId: companyId ? companyId : null,
        reference: reference? reference : null
      },
      fetchPolicy: 'no-cache'
    }
    ).pipe(
      map((p: any) => {
        return p.data.getCountOfAllPost
      }),
    )
  }

  getEmailPhoneCountForContact(type: string): Observable<any> {
    return this.apollo.query({
      query : gql`
        query getEmailPhoneCountForContact($type: String) {
          getEmailPhoneCountForContact(type: $type) {
            _id
            emailCount
            phoneCount
          }
        }
      `,
      variables: {
        type: type ? type : 'contact'
      },
      fetchPolicy: 'no-cache'
    }
    ).pipe(
      map((p: any) => {
        return p.data.getEmailPhoneCountForContact
      }),
    )
  }

  redirectToPostDetails(post, commentId = ''): void {
    // this.store.dispatch(SetSelectedPost({ post: null }));

    // if (post.type === PostType.Dreamjob) {
    //   this.redirectToDreamJobDetails(post, commentId);
    // } else if (post.type === PostType.Event) {
    //   this.redirectToEventDetails(post, commentId);
    // } else {
    // }
    this.router.navigate(['/','post',post.slug ? post.slug : ''],
      { queryParams: commentId ? { commentId } : null }
    );
  }

  redirectToDreamJobDetails(dreamJob, commentId = ''): void {
    this.router.navigate(['/', PostType.Dreamjob, dreamJob.slug], { queryParams: commentId ? { commentId } : null });
  }

  redirectToEventDetails(event, commentId = ''): void {
    this.router.navigate(['/', PostType.Event, event.slug], { queryParams: commentId ? { commentId } : null });
  }

  editPost(post): void {
    this.router.navigate(['/post', 'edit-post', post._id], {queryParams: {type: post.type}});
  }

  rsvpEvent(eventId: string): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation rsvpEvent($userId: String, $eventId: String) {
            rsvpEvent(userId: $userId, eventId: $eventId) {
              validSubscription
              usersAttending {
                name
                _id
                avatar
              }
            }
          }
        `,
        variables: {
          userId: this.authService.loggedInUser._id,
          eventId,
        }
      }
    ).pipe(
      map((p: any) => p.data.rsvpEvent),
      catchError(e => of(e))
    );
  }

  cancelRSVP(eventId: string): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation cancelRSVP($userId: String, $eventId: String) {
            cancelRSVP(userId: $userId, eventId: $eventId) {
              usersAttending {
                name
                _id
                avatar
              }
            }
          }
        `,
        variables: {
          userId: this.authService.loggedInUser._id,
          eventId,
        }
      }
    ).pipe(
      map((p: any) => p.data.cancelRSVP),
      catchError(e => of(e))
    );
  }

  myRSVP(userId: string) {
    return this.apollo.query(
      {
        query: gql`
          query myRSVP($userId: String) {
            myRSVP(userId: $userId){
              name
              _id
              createdBy {
                name
                _id
                avatar
              }
              dateRange
              type
            }
          }
        `,
        variables: {
          userId
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.myRSVP;
      }),
    );
  }

  searchPosts(searchString: string): Observable<Post[]> {
    return this.apollo.query(
      {
        query: gql`
          query fullSearch($searchString: String) {
            fullSearch(searchString: $searchString){
              name
              _id
              createdBy {
                name
                _id
                avatar
              }
              type
              slug
            }
          }
        `,
        variables: {
          searchString
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.fullSearch;
      }),
    );
  }

  fetchFiles(blockType: string, userId: string) {
    return this.apollo.query(
      {
        query: gql`
          query fetchFiles($blockType: String, $userId: String) {
            fetchFiles(blockType: $blockType, userId: $userId) {
              ...Description
            }
          }
          ${description}
        `,
        variables: {
          blockType,
          userId
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.fetchFiles;
      }),
    );
  }
}
