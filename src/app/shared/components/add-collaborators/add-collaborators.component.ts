import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PostService } from '../../services/post.service';
@Component({
  selector: 'app-add-collaborators',
  templateUrl: './add-collaborators.component.html',
  styleUrls: ['./add-collaborators.component.scss']
})
export class AddCollaboratorsComponent implements OnInit {

  @Input() postDetails;

  public addCollaboratorForm = new FormGroup({
    collaborators : new FormControl('', Validators.required)
  })

  
  constructor(
    private postService: PostService,
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
    this.postService.updatePost(collaboratorsObj).subscribe((j) => {
      
    })
  }
}
