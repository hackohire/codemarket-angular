import { Component, OnInit } from '@angular/core';
import { TILDE } from '@angular/cdk/keycodes';
import { AddHomeworkService } from './add-homework.service';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss']
})
export class HomeworkComponent implements OnInit {

  /** create Form Field Object, inside it will store values */
  formFieldObject: any;

  constructor(
    private addHomeworkService: AddHomeworkService
  ) { }

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

    this.addHomeworkService.addAssignment(this.formFieldObject).subscribe( (assignment) => {
      if (assignment) {
        this.formFieldObject = assignment;
      }
    })
  
  }

  updateAssignment(assignmentNoassignmentNo, title, assignmentUrl, assignmentDescription) {}

}
