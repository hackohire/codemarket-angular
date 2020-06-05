import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  invokeAppointmentDateTime = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  onCalanderDateSelectClick(date: any) {
    this.invokeAppointmentDateTime.emit(date);
  }
}
