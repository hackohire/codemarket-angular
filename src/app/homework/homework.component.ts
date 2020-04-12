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

  /*
  getAssignment(assignmentNo, title) {

    var assignmentDescription = "This is your homework assignment!"
    this.formFieldObject = {
      assignmentNo: assignmentNo,
      title: title,
      assignmentDescription: assignmentDescription
    };
  }
  */

  addAssignment(assignmentNo, title, detailDescription) {

    try {
      //var assignmentNoInt = parseInt(assignmentNo);

      const formFieldObject = {
        assignmentNo: assignmentNo,
        title: title,
        detailDescription: detailDescription
      };

      this.addHomeworkService.addHomework(formFieldObject).subscribe((assignment) => {
        if (assignment) {
          this.formFieldObject = assignment;
        }
      })

    }
    catch (e) {
      console.log("Error:  input field assignmentNo is not a valid integer\n");
    }

  }

  //updateAssignment(assignmentNoassignmentNo, title, assignmentUrl, assignmentDescription) { }

}
