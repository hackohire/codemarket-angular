import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss']
})
export class TimeSlotsComponent implements OnInit {

  @Input() slots;
  public slotList = [];
  constructor() { 
  }
  
  ngOnInit() {
  }
  
  ngOnChanges(changes: any) {  
    this.slotList = changes.slots.currentValue;
  }


}
