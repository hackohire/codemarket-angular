import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { selectSelectedPost } from '../../../core/store/selectors/post.selectors';
@Component({
  selector: 'app-add-collaborators',
  templateUrl: './add-collaborators.component.html',
  styleUrls: ['./add-collaborators.component.scss']
})
export class AddCollaboratorsComponent implements OnInit {

  public addCollaboratorForm = new FormGroup({
    collaborators : new FormControl('', Validators.required)
  })

  
  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
  }

  addCollaborators() {
    console.log(this.addCollaboratorForm.value);
    const collaboratorsObj = {...this.addCollaboratorForm.value};
    this.postService.updatePost(collaboratorsObj).subscribe((j) => {
      
    })
  }
}
