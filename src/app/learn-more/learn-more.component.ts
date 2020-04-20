import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-learn-more',
  templateUrl: './learn-more.component.html',
  styleUrls: ['./learn-more.component.scss']
})
export class LearnMoreComponent implements OnInit {

  learnMoreType = null;
  learnMoreTypeValue = null;

  constructor(private router:Router, private activatedRoute:ActivatedRoute) {
    this.learnMoreType = this.router.getCurrentNavigation().extras.state
    console.log(this.learnMoreType)
    if(this.learnMoreType){
      this.learnMoreTypeValue = this.learnMoreType.about
    }
   }

  ngOnInit() {
  }

}
