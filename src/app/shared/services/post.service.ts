import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/observable';
import gql from 'graphql-tag';
import { map, catchError, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../core/store/state/app.state';
import { Post } from '../models/post.model';
import { SetSelectedPost } from '../../core/store/actions/post.actions';
import { productConstants } from '../constants/product_constants';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs/observable/of';
import { PostType } from '../models/post-types.enum';
import { appConstants } from '../constants/app_constants';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postFields = appConstants.postQuery;
  constructor(
    private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
    private readonly transferState: TransferState,
    private httpClient: HttpClient,
  ) { }


  getPostsByUserIdAndType(userId: string, status: string, postType: string): Observable<Post[]> {
    return this.apollo.query(
      {
        query: gql`
          query getPostsByUserIdAndType($userId: String, $status: String, $postType: String) {
            getPostsByUserIdAndType(userId: $userId, status: $status, postType: $postType) {
              ...Post
            }
          }
          ${this.postFields}
        `,
        variables: {
          userId,
          status,
          postType
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
        }
      }
    ).pipe(
      map((p: any) => {
        /** Sets the data to transferState */
        this.transferState.set(key, p.data.getPostById);
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

  updatePost(post: Post): Observable<Post> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updatePost($post: PostInput) {
            updatePost(post: $post) {
              ...Post
            }
          }
          ${this.postFields}
        `,
        variables: {
          post
        }
      }
    ).pipe(
      map((p: any) => p.data.updatePost),
    );
  }

  deletePost(postId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deletePost($postId: String) {
            deletePost(postId: $postId)
          }
        `,
        variables: {
          postId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deletePost;
      }),
    );
  }

  getAllPosts(pageOptions, type): Observable<Post[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllPosts($pageOptions: PageOptionsInput, $type: String) {
            getAllPosts(pageOptions: $pageOptions, type: $type) {
              posts {
                ...Product
              }
              total
            }
          }
          ${productConstants.productQueryFields}
        `,
        variables: {
          pageOptions,
          type: type ? type : ''
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllPosts;
      }),
    );
  }

  redirectToPostDetails(post, setSelectedPost?: boolean): void {
    this.store.dispatch(SetSelectedPost({ post: null }));

    this.router.navigate(['/',
      post.type === 'product' ? 'product' : 'post',
      post.slug ? post.slug : ''
    ],
      { queryParams: { type: post.type } });
  }

  editPost(post): void {

    if (post.type === PostType.Product) {
      this.router.navigate(['/', 'sell', 'edit-product', post._id]);
    } else {
      this.router.navigate(['/', 'post', 'edit-' + post.type, post._id]);
    }
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
}
