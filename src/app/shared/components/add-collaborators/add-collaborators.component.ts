import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { MdePopoverTrigger } from '@material-extended/mde';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-add-collaborators',
  templateUrl: './add-collaborators.component.html',
  styleUrls: ['./add-collaborators.component.scss']
})
export class AddCollaboratorsComponent implements OnInit {

  @Input() postDetails;
  @Output() updatePost = new EventEmitter();

  public addCollaboratorForm = new FormGroup({
    collaborators : new FormControl('', Validators.required)
  });

  @ViewChild(MdePopoverTrigger, {static: false}) collaboratorsPopover: MdePopoverTrigger;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.postDetails.collaborators && this.postDetails.collaborators.length > 0) {
      this.addCollaboratorForm.controls.collaborators.setValue(this.postDetails.collaborators);
  }
 }

  addCollaborators() {
    const collaboratorsObj = {
      _id: this.postDetails._id,
      ...this.addCollaboratorForm.value
    };
    this.postService.updatePost(
      collaboratorsObj,
      { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
    ).subscribe((j) => {
      if (j) {
        this.postDetails.collaborators = j.collaborators;
        this.collaboratorsPopover.closePopover();
      }
    });
  }
}
