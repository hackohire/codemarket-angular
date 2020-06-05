import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarMonthViewDay } from 'angular-calendar';
import { ChatService } from '../../services/chat.service';
import moment from 'moment';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalenderComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  minDate: Date = new Date();

  constructor(
    private _appointmentService: AppointmentService
  ) { }

  ngOnInit() {
    this._appointmentService.onCalanderDateSelectClick(moment().format('YYYY-MM-DDTHH:mm:ss'));
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this._appointmentService.onCalanderDateSelectClick(moment(date).format('YYYY-MM-DDTHH:mm:ss'));
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate;
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }
}
