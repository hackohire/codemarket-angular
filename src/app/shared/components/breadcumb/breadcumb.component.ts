import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Post } from '../../models/post.model';
import { Company } from '../../models/company.model';
import { FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { PostService } from '../../services/post.service';
import { SearchComponent } from 'src/app/core/components/search/search.component';
import { MdePopoverTrigger } from '@material-extended/mde';

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

  @Output() editPost = new EventEmitter();

  articleLink = new FormControl('', Validators.required);
  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
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

}
