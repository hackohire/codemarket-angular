import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { of, Observable, concat, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { appConstants } from '../../../shared/constants/app_constants';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  listItems$: Observable<Post[]>;
  icons = appConstants.icons;
  routerSubscription$: Subscription;
  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(
    public postService: PostService,
    public dialogRef: MatDialogRef<SearchComponent>,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerSubscription$ = this.router.events.subscribe(e => {
      if (e) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription$) {
      this.routerSubscription$.unsubscribe();
    }
  }

  ngAfterViewInit() {

    this.listItems$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.postService.searchPosts(search)),
        tap(d => console.log(d))
      );

  }


  // handleSearch(value) {
  //   this.listItems$ = of(value).pipe(
  //     debounceTime(400),
  //     distinctUntilChanged(),
  //     switchMap(search => this.postService.searchPosts(search))
  //   )
  // }

}
