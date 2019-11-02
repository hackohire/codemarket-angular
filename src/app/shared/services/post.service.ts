import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/observable';
import gql from 'graphql-tag';
import { map, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../core/store/state/app.state';
import { Post } from '../models/post.model';
import { description } from '../constants/fragments_constatnts';
import { SetSelectedPost } from '../../core/store/actions/post.actions';
import { productConstants } from '../constants/product_constants';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs';
import { PostType } from '../models/post-types.enum';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postFileds = gql`
  fragment Post on Post {
    _id
    name
    type
    categories
    description {
      ...Description
    }
    price
    status
    createdAt
    updatedAt
    tags {
      name
      _id
    }
    support {
      time
      description {
        ...Description
      }
    }
    likeCount
    createdBy {
      _id
      name
      avatar
    }
    purchasedBy {
      name
      _id
      createdAt
      avatar
    }

    dateRange
    address
    eventType
    usersAttending {
      name
      _id
      avatar
    }

    company {
      name
      _id
    }
    salaryRangeFrom
    salaryRangeTo
    cities {
      name
      _id
    }
    jobProfile

  }
  ${description}
  `;

  constructor(
    private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService
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
          ${this.postFileds}
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
          ${this.postFileds}
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
    return this.apollo.query(
      {
        query: gql`
          query getPostById($PostId: String) {
            getPostById(postId: $PostId) {
              ...Post
            }
          }
          ${this.postFileds}
        `,
        variables: {
          PostId
        }
      }
    ).pipe(
      map((p: any) => {
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
        ${this.postFileds}
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
          ${this.postFileds}
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

  getAllPosts(pageOptions): Observable<Post[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllPosts($pageOptions: PageOptionsInput) {
            getAllPosts(pageOptions: $pageOptions) {
              posts {
                ...Product
              }
              total
            }
          }
          ${productConstants.productQueryFields}
        `,
        variables: {
          pageOptions
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
    // if (setSelectedPost) {
    //   this.store.dispatch(SetSelectedPost({ post }));
    // } else {
    //   // this.store.dispatch(SetSelectedPost({ post: null }));
    // }

    this.router.navigate(['/', { outlets: { main: ['dashboard', `${post.type}-details`, post._id] } }],
      { queryParams: { type: post.type, postId: post._id } });
  }

  editPost(post): void {

    if (post.type === PostType.Product) {
      this.router.navigate(['/', { outlets: { main: ['sell', 'edit-product', post._id] } }]);
    } else {
      this.router.navigate(['/', { outlets: { main: ['post', 'edit-' + post.type, post._id] } }]);
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
