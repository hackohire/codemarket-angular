import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom } from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddPost, PostAddedSuccessfully, GetPostById, SetSelectedPost, GetPostsByUserIdAndType, UpdatePost, PostUpdated, DeletePost, GetPostsByType, SetPostsByUserIdAndType, SetPostsByType } from '../actions/post.actions';
import { Post } from 'src/app/shared/models/post.model';
import { selectPostsByUserIdAndType } from '../selectors/post.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { PostService } from 'src/app/shared/services/post.service';

@Injectable()
export class PostEffects {

    @Effect()
    addPost$ = this.actions$.pipe(
        ofType(AddPost),
        map(action => action.post),
        switchMap((post) => this.postService.addPost(post)),
        map((post: Post) => {
            this.sweetAlertService.success(`${post.type} has been ${post.status} Successfully`, '', 'success');
            this.postService.redirectToPostDetails(post);
            return PostAddedSuccessfully({ post });
        }),
    );

    @Effect()
    getPostsByUserIdAndType$ = this.actions$.pipe(
        ofType(GetPostsByUserIdAndType),
        switchMap((value) => this.postService.getPostsByUserIdAndType(value.userId, value.status, value.postType)),
        tap(u => console.log(u)),
        map((res) => {
            console.log(res);
            return SetPostsByUserIdAndType({post: res.posts, total: res.total });
        })
    );

    @Effect()
    getPostById$ = this.actions$.pipe(
        ofType(GetPostById),
        map(action => action.postId),
        switchMap((postId) => this.postService.getPostById(postId)),
        tap(u => console.log(u)),
        map((post: Post) => {
            console.log(post);
            return SetSelectedPost({ post });
        })
    );


    @Effect()
    getPostsByType$ = this.actions$.pipe(
        ofType(GetPostsByType),
        map(action => action.postType),
        switchMap((postType: string) => this.postService.getPostsByType(postType)),
        tap(u => console.log(u)),
        map((post: Post[]) => {
            console.log(post);
            return SetPostsByType({ post });
        })
    );

    @Effect()
    updatePost$ = this.actions$.pipe(
        ofType(UpdatePost),
        // map(action => action.post),
        switchMap((action) => this.postService.updatePost(action.post, action.updatedBy)),
        tap(u => console.log(u)),
        map((post: Post) => {
            console.log(post);
            this.sweetAlertService.success(`${post.type}  changes has been ${post.status} Successfully`, '', 'success');
            this.postService.redirectToPostDetails(post);
            return PostUpdated({ post });
        })
    );


    @Effect()
    deletePost$ = this.actions$.pipe(
        ofType(DeletePost),
        // map(action => action.postId),
        switchMap((action) => {
            return this.postService.deletePost(action.postId, action.deletedBy).pipe(
                withLatestFrom(this.store.select(selectPostsByUserIdAndType)),
                map(([isDeleted, posts]) => {
                    if (isDeleted && posts && posts.length) {
                        let deletedPostIndex = -1;
                        deletedPostIndex = posts.findIndex((p) => p._id === action.postId);
                        if (deletedPostIndex > -1) {
                            posts.splice(deletedPostIndex, 1);
                        }
                    }
                    return [...posts];
                })
            );
        }),
        map((post: Post[]) => {
            return SetPostsByUserIdAndType({ post });
        }),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private postService: PostService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
