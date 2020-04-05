import { Component, OnInit } from '@angular/core';
import { TILDE } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss']
})
export class HomeworkComponent implements OnInit {

  /** create Form Field Object, inside it will store values */
  formFieldObject: any;

  constructor() { }

  ngOnInit() {
  }

  getAssignment(assignmentNo, title) {

    var assignmentPost = "This is your homework assignment!"
    this.formFieldObject = {
      assignmentNo: assignmentNo,
      title: title,
      assignmentPost: assignmentPost
    };
  }

  addAssignment(assignmentNo, title, assignmentUrl, assignmentPost) {

    this.formFieldObject = {
      assignmentNo: assignmentNo,
      title: title,
      assignmentUrl: assignmentUrl,
      assignmentPost: assignmentPost
    };

  }

  updateAssignment(assignmentNoassignmentNo, title, assignmentUrl, assignmentPost) {}

}
