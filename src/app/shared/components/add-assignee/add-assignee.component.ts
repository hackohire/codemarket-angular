import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-add-assignee',
  templateUrl: './add-assignee.component.html',
  styleUrls: ['./add-assignee.component.scss']
})
export class AddAssigneeComponent implements OnInit {

  @Input() postDetails;
  @Output() updatePost = new EventEmitter();

  public addAssigneesForm = new FormGroup({
    assignees : new FormControl('', Validators.required)
  });

  @ViewChild(MdePopoverTrigger) assigneesPopover: MdePopoverTrigger;

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {
    if (this.postDetails.assignees && this.postDetails.assignees.length > 0) {
      this.addAssigneesForm.get('assignees').setValue(this.postDetails.assignees);
    }
 }

  addAssignees() {
    const assigneesObj = {
      _id: this.postDetails._id,
      ...this.addAssigneesForm.value
    };
    this.postService.updatePost(assigneesObj).subscribe((j) => {
      if (j) {
        this.postDetails.assignees = j.assignees;
        this.assigneesPopover.closePopover();
      }
    });
  }

}
