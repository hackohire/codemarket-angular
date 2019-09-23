import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from 'src/app/core/store/state/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
import { Post } from '../models/post.model';
import { description } from '../constants/fragments_constatnts';
import { SetSelectedPost } from 'src/app/core/store/actions/post.actions';
import { productConstants } from '../constants/product_constants';

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
  }
  ${description}
  `;

  constructor(
    private apollo: Apollo,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router
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
          userId: userId,
          status: status,
          postType: postType
        },
        fetchPolicy:  'no-cache'
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
          postTye: postTye
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
          PostId: PostId
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
        post: post
      }
    }).pipe(
      map(q => q.data.addPost)
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
          post: post
        }
      }
    ).pipe(
      map((p) => p.data.updatePost),
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
          postId: postId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deletePost;
      }),
    );
  }

  getAllPosts(): Observable<Post[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllPosts {
            getAllPosts {
              ...Product
            }
          }
          ${productConstants.productQueryFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllPosts;
      }),
    );
  }

  redirectToPostDetails(post): void {
    this.store.dispatch(SetSelectedPost({ post }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', `${post.type}-details`, post._id]}}],
      { queryParams: {type: post.type, postId: post._id}} );
  }
}
