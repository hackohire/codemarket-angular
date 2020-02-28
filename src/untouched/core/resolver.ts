import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PostService } from '../shared/services/post.service';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators/tap';
import { Store } from '@ngrx/store';
import { AppState } from './store/state/app.state';
import { SetSelectedPost } from './store/actions/post.actions';

/** This resolver fetches the post data & dispatch the action befor loading the
 *  Post Details or Product Details Component
 */
@Injectable()
export class PostDataResolver implements Resolve<any> {
  constructor(
    private postService: PostService,
    private store: Store<AppState>
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const type = route.queryParams.type;
    const params = route.params;
    const postId = params && params.slug ? params.slug.split('-').pop() : '';

    if (type !== 'company') {

      return this.postService.getPostById(postId).pipe(
        tap(p => {
          if (p) {
            this.store.dispatch(SetSelectedPost({post: p}));
          }
        })
      )
    }
    return of(null);
  }
}