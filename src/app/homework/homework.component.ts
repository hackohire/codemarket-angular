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

    var assignmentDescription = "This is your homework assignment!"
    this.formFieldObject = {
      assignmentNo: assignmentNo,
      title: title,
      assignmentDescription: assignmentDescription
    };
  }

  addAssignment(assignmentNo, title, assignmentDescription) {

    this.formFieldObject = {
      assignmentNo: assignmentNo,
      title: title,
      assignmentDescription: assignmentDescription
    };

  }

  updateAssignment(assignmentNoassignmentNo, title, assignmentUrl, assignmentDescription) {}

}
