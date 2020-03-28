import { Component, OnInit } from '@angular/core';

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

  getAssignment(assignmentNo) {

    var assignmentPost = "This is your homework assignment!"
    this.formFieldObject = {
      assignmentNo: assignmentNo,
      assignmentPost: assignmentPost
    };
  }

  addAssignment(assignmentNo, assignmentPost) {}

  updateAssignment(assignmentNo) {}

}
