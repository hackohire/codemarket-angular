import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  providers: [CommentService]
})
export class ChatBoxComponent implements OnInit {
 
  @Input() comments: Comment[];
  @Input() loggedInUserId;

  constructor() { }

  ngOnInit() {
    console.log("IN chat box ==> ", this.comments)
    // this.comments.forEach((cm) => {
    //   console.log("Single comment ==> ", cm)
    // })
  }

}
