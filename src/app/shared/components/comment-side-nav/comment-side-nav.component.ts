import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, share } from 'rxjs/operators';

@Component({
  selector: 'app-comment-side-nav',
  templateUrl: './comment-side-nav.component.html',
  styleUrls: ['./comment-side-nav.component.scss']
})
export class CommentSideNavComponent implements OnInit, OnChanges {

  @Input() selectedBlock = null;
  @Input() selectedPost: Post;
  @Input() comments: Comment[];

  @Output() closeCommentSideBar = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    share()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    console.log(this.selectedBlock);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

}
