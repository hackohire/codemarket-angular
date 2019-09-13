import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BreadcumbComponent } from './components/breadcumb/breadcumb.component';
import { HighlightModule } from 'ngx-highlightjs';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import scss from 'highlight.js/lib/languages/scss';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { CommentComponent } from './components/comment/comment.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ShareModule } from '@ngx-share/core';
import { SafePipe } from './pipes/safe.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import '../../icons';
import { LikeDislikeComponent } from './components/like-dislike/like-dislike.component';

export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'javascript', func: javascript},
    {name: 'scss', func: scss}
  ];
}
@NgModule({
  declarations: [BreadcumbComponent, EditorComponent, CommentComponent, DatatableComponent, SafePipe, LikeDislikeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    QuillModule.forRoot(),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    HighlightModule.forRoot({languages: hljsLanguages}),
    FlexLayoutModule,
    RouterModule,
    ShareButtonsModule,
    FontAwesomeModule,
    ShareModule
  ],
  exports: [
    BreadcumbComponent,
    EditorComponent,
    CommentComponent,
    DatatableComponent,
    LikeDislikeComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    QuillModule,
    HighlightModule,
    FlexLayoutModule,
    SweetAlert2Module,
    ShareButtonsModule,
    ShareModule,
    FontAwesomeModule,
    SafePipe
  ]
})
export class SharedModule { }
