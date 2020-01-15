import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../models/post.model';
import { Company } from '../../models/company.model';
import { FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { PostService } from '../../services/post.service';

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
  @Input('color') color = 'white';
  @Input('showMenu') showMenu = true;
  @Input('showImportButton') showImportButton = false;
  @Input('showEditPostDetails') showEditPostDetails: boolean;

  @Output() editPost = new EventEmitter();

  articleLink = new FormControl('', Validators.required)
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
        this.postService.contentFromAnotherArticle.next(h.contentHtml);
      })
  }

}
