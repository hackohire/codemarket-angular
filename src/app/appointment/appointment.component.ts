import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ChatService } from '../shared/services/chat.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  public slotList = [];
  public slotDateTime: any;
  public appointmentForm: FormGroup;
  public selectedDate: string;
  public displayDate: string = "";

  constructor(
    private _chatService: ChatService
  ) { }

  ngOnInit() {
    //  Initialize appointment form
    this.appointmentForm = new FormGroup({
      description: new FormControl('', Validators.required),
    });

    // Subscribing calendar event
    if (this._chatService.subsVar == undefined) {
      this._chatService.subsVar = this._chatService.
        invokeAppointmentDateTime.subscribe((date: any) => {
          this.selectedDate = date;
          this.intervals();
        });
    }
  }

  intervals() {
    const start = moment('00:00', 'hh:mm a');
    const end = moment('23:45', 'hh:mm a');
    start.minutes(Math.ceil(start.minutes() / 30) * 30);
    const result = [];
    const current = moment(start);
    while (current <= end) {
      result.push(current.format('HH:mm'));
      current.add(15, 'minutes');
    }
    console.log(result);
    this.slotList = result;
  }

  selectedSlot(slot: string) {
    console.log(slot);
    this.slotDateTime = slot;
    const addTime = this.selectedDate.split('T');
    this.displayDate = moment(addTime[0] + ' ' + this.slotDateTime).format('YYYY-MM-DD h:mm:ss');
    console.log(this.selectedDate);
  }

  confirmAppointment() {
    console.log(this.appointmentForm.value);
    console.log(this.selectedDate);
    console.log(this.slotDateTime);
  }
}
