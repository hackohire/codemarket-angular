import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormBuilderService } from '../form-builder/form-builder.service';
import { PostService } from '../shared/services/post.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  msbapTitle = 'Audio Title';
  msbapAudioUrl = '../../assets/audio/happy-Joel-Drazner.mp3';

  msbapDisplayTitle = false;
  msbapDisplayVolumeControls = true;

  constructor(
    public postService: PostService,
    public authService: AuthService,
    private formBuilderService: FormBuilderService
  ) { }

  ngOnInit() {
  }

  convertObjectToArray(d) {
    return Object.keys(d);
  }

}
