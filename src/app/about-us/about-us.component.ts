import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {

  constructor(public authService: AuthService) {
  }

}
