import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { Company } from '../../models/company.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PostStatus } from '../../../shared/models/poststatus.enum';
import { environment } from '../../../../environments/environment';
import { PostService } from '../../services/post.service';
import { SearchComponent } from 'src/app/core/components/search/search.component';
import { MdePopoverTrigger } from '@material-extended/mde';
import { ShareService } from '@ngx-share/core';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})
export class BreadcumbComponent implements OnInit {

  @Input() title: string;
  @Input() path: [];
  @Input() eventDate: [];
  @Input() postDetails;
  @Input() companyDetails: Company;
  @Input() color = 'white';
  @Input() showMenu = true;
  @Input() showImportButton = false;
  @Input() showEditPostDetails: boolean;
  @Input() showAddCollaborators: boolean;
  @Input() showAddAssignee: boolean;
  @Input() showAddClients: boolean;
  @Input() showShareButtons: boolean;
  @Input() fromAddPost = false;
  @Input() inline = false;
  @Input() postForm: FormGroup;

  @Output() editPost = new EventEmitter();

  @Output() addPostData = new EventEmitter();

  articleLink = new FormControl('', Validators.required);

  postTitle = '';

  displaySave = false;

  public emptyPostForm: FormGroup;

  public name;

  @ViewChild(MdePopoverTrigger, {static: false}) addTagsPopover: MdePopoverTrigger;
  @ViewChild(MdePopoverTrigger, {static: false}) addCopmaniesPopover: MdePopoverTrigger;
  @ViewChild(MdePopoverTrigger, {static: false}) addClientsPopover: MdePopoverTrigger;
  @ViewChild(MdePopoverTrigger, {static: false}) addCollaboratorsPopover: MdePopoverTrigger;

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  constructor(
    private postService: PostService,
    public share: ShareService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    console.log("Thisi is inline ==> ", this.inline);
  }

  import() {
    console.log(this.articleLink.value);
    fetch(`${environment.serverless_url}fetchArticleByLink?url=${encodeURIComponent(this.articleLink.value)}`)
      .then(res => res.json())
      .then(h => {
        console.log(h.contentHtml);
        h.contentHtml += `<b>Source: </b><a target="_blank" href="${this.articleLink.value}">${this.articleLink.value}</a>`
        this.postService.contentFromAnotherArticle.next(h.contentHtml);
      });
  }

  onContentChange(event:any) {
    let a = document.getElementById('test').innerHTML;
    this.postTitle = a;
    this.postForm.get('name').setValue(this.postTitle.replace(/\&nbsp;/g, ''));
  }

  myFunction() {
    const postObj = {
      _id: this.postDetails._id,
      name: this.postTitle
    };
    
    if (this.title !== this.postTitle.replace(/\&nbsp;/g, '') && this.postTitle.replace(/\&nbsp;/g, '') !== '') {
      this.displaySave = true;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j) {
          this.title = this.postTitle.replace(/\&nbsp;/g, '');
          this.displaySave = false;
        }
      });
    }
  }

  addDataOfPost(data) {
    const postObj = {
      _id: this.postDetails._id,
    };
    if (data === 'tags') {
      postObj['tags'] = this.postForm.controls.tags.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j) {
          this.postDetails.tags = j.tags;
          this.addTagsPopover.closePopover();
        }
      });
    }

    if (data === 'companies') {
      postObj['companies'] = this.postForm.controls.companies.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j) {
          this.postDetails.companies = j.companies;
          this.addCopmaniesPopover.closePopover();
        }
      });
    }

    if (data === 'clients') {
      postObj['clients'] = this.postForm.controls.clients.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j) {
          this.postDetails.clients = j.clients;
          this.addClientsPopover.closePopover();
        }
      });
    }

    if (data === 'collaborators') {
      postObj['collaborators'] = this.postForm.controls.collaborators.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j) {
          this.postDetails.collaborators = j.collaborators;
          this.addCollaboratorsPopover.closePopover();
        }
      });
    }
  }

  displayData(data) {
    this.addPostData.emit(this.postForm.value);
  }

  doNothing() {
    console.log("Do nothing called  ");
  }

  allowUsersEdit = () => {
    const loggedInUser = this.authService.loggedInUser;
    return loggedInUser && loggedInUser._id && this.postDetails && this.postDetails._id && (loggedInUser._id === this.postDetails.createdBy._id || this.postDetails.collaborators.find(c => c._id === loggedInUser._id));
  }
}
