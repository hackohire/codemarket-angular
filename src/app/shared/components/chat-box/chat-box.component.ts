import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
 
  @Input() comments: Comment[];
  @Input() loggedInUserId;

  @Input() postDetails;

  constructor(
  ) { }

  ngOnInit() {
  }
}
