import { NgModule, Injector } from '@angular/core';
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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AddPostMenuComponent } from './components/add-post-menu/add-post-menu.component';
import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';
// import { Ng5SliderModule } from 'ng5-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { MdePopoverModule } from '@material-extended/mde';
import { CommentService } from './services/comment.service';
import { ToastrModule } from 'ngx-toastr';
import { BriefPostComponent } from './components/brief-post/brief-post.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AddCollaboratorsComponent } from './components/add-collaborators/add-collaborators.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { PostTypeNavComponent } from './components/post-type-nav/post-type-nav.component';
import { CommentSideNavComponent } from './components/comment-side-nav/comment-side-nav.component';
import { AppInjector } from './services/app.injector.service';
import { ChatService } from './services/chat.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GetNamePipe } from './pipes/get-name.pipe';
import { CalenderComponent } from './components/calender/calender.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AppointmentService } from './services/appointment.service';
import { ChatFullUiComponent } from './components/chat-full-ui/chat-full-ui.component';
import { TimeSlotsComponent } from './components/time-slots/time-slots.component';
import { BookingComponent } from './components/booking/booking.component';
export function hljsLanguages() {
  return [
    { name: 'typescript', func: typescript },
    { name: 'javascript', func: javascript },
    { name: 'scss', func: scss }
  ];
}
@NgModule({
  declarations: [
    BreadcumbComponent,
    EditorComponent,
    CommentComponent,
    DatatableComponent,
    SafePipe,
    AddPostMenuComponent,
    CompaniesListComponent,
    BriefPostComponent,
    AutocompleteComponent,
    AddCollaboratorsComponent,
    PaginatorComponent,
    AddCommentComponent,
    PostTypeNavComponent,
    CommentSideNavComponent,
    GetNamePipe,
    CalenderComponent,
    ChatFullUiComponent,
    TimeSlotsComponent,
    BookingComponent
  ],
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
    HighlightModule.forRoot({ languages: hljsLanguages }),
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
    ToastrModule.forRoot({
      closeButton: true,
      enableHtml: true,
      timeOut: 30000,
      extendedTimeOut: 8000
    }),
    CKEditorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    BreadcumbComponent,
    EditorComponent,
    CommentComponent,
    AddCommentComponent,
    DatatableComponent,
    AddPostMenuComponent,
    BriefPostComponent,
    AutocompleteComponent,
    PaginatorComponent,
    PostTypeNavComponent,
    CommentSideNavComponent,
    BookingComponent,
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
    CalenderComponent,
    ChatFullUiComponent,
    TimeSlotsComponent
  ],
  entryComponents: [
    ChatFullUiComponent,
    BookingComponent
  ],
  providers: [CommentService, ChatService, AppointmentService]
})
export class SharedModule {
  constructor(private injector: Injector) {
    AppInjector.setInjector(this.injector);
  }
}
