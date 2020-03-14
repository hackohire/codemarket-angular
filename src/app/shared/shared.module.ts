import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { LikeDislikeComponent } from './components/like-dislike/like-dislike.component';
import { VideoChatComponent } from '../video-chat/video-chat.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AddPostMenuComponent } from './components/add-post-menu/add-post-menu.component';
import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';
// import { Ng5SliderModule } from 'ng5-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { MdePopoverModule } from '@material-extended/mde';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { CommentService } from './services/comment.service';
import { ToastrModule } from 'ngx-toastr';
import { AddJobComponent } from '../job/add-job/add-job.component';
import { AddCompanyComponent } from '../companies/add-company/add-company.component';
import { BriefPostComponent } from './components/brief-post/brief-post.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AddHowtodocComponent } from '../howtodoc/add-howtodoc/add-howtodoc.component';
import { AddAssignmentComponent } from '../assignment/add-assignment/add-assignment.component';
import { AddCollaboratorsComponent } from './components/add-collaborators/add-collaborators.component';
import { AddAssigneeComponent } from './components/add-assignee/add-assignee.component';


export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'javascript', func: javascript},
    {name: 'scss', func: scss}
  ];
}
@NgModule({
  declarations: [BreadcumbComponent, EditorComponent, CommentComponent, DatatableComponent, SafePipe, LikeDislikeComponent, VideoChatComponent, AddPostMenuComponent, CompaniesListComponent, AddJobComponent, BriefPostComponent, AutocompleteComponent, AddHowtodocComponent, AddAssignmentComponent, AddCollaboratorsComponent, AddAssigneeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
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
    ShareModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // Ng5SliderModule,
    NgSelectModule,
    MdePopoverModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleAPIKey,
      libraries: ['places']
    }),
    ToastrModule.forRoot({
      closeButton: true,
      enableHtml: true,
      timeOut: 30000,
      extendedTimeOut: 8000
    })
  ],
  exports: [
    BreadcumbComponent,
    EditorComponent,
    CommentComponent,
    DatatableComponent,
    LikeDislikeComponent,
    VideoChatComponent,
    AddPostMenuComponent,
    BriefPostComponent,
    AutocompleteComponent,
    AddHowtodocComponent,
    AddAssignmentComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HighlightModule,
    FlexLayoutModule,
    SweetAlert2Module,
    ShareButtonsModule,
    ShareModule,
    FontAwesomeModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SafePipe,
    // Ng5SliderModule,
    NgSelectModule,
    MdePopoverModule,
    AgmCoreModule
  ],
  entryComponents: [
    AddJobComponent,
    VideoChatComponent
  ],
  providers: [CommentService]
})
export class SharedModule { }
