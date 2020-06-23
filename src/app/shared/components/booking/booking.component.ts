import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post, BookingSlot } from '../../models/post.model';
import { User } from '../../models/user.model';
import { UserService } from '../../../user/user.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { get } from 'lodash';
declare let paypal: any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, AfterViewInit {

  width = 220;
  height = 35;
  shape = 'rect';
  color = 'gold';
  label = 'paypal';
  layout = 'horizontal';

  duration: any[];
  slots: string[];
  selectedFromSlot: string;
  selectedToSlot: string;
  interval = 15;

  showPaypal = false;

  constructor(
    public matDialogRef: MatDialogRef<BookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post, loggedInUser: User, availability: BookingSlot },
    private userService: UserService
  ) { }

  ngOnInit() {

    /** Get the availability date & duation */
    const availability = get(this.data, 'availability');
    this.duration = availability.duration;

    if (this.duration) {
      const startTime = this.parseTime(this.duration[0]);
      const endTime = this.parseTime(this.duration[1]);

      /** Convert the from & to time to the 15 minutes solts */
      this.slots = this.calculate_time_slot(startTime, endTime, this.interval);

      console.log(this.slots);
    }
  }

  ngAfterViewInit() {
  }

  /** Load Paypal Button */
  private loadPaypal() {
    this.loadExternalScript(`https://www.paypal.com/sdk/js?client-id=${environment.paypal_client}&currency=USD&commit=true`).then(() => {
      paypal.Buttons({
        style: {
          shape: 'pill',
          color: 'blue',
          layout: 'horizontal',
          label: 'paypal',
          size: 'responsive',
          tagline: false
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.data.post.price
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            console.log('Transaction completed by ' + details.payer.name.given_name + '!');
            this.userService.createTransaction({
              transaction: details,
            }).toPromise().then((u: any) => {
              console.log(u);
              if (u) {
                Swal.fire('Thank You!', '', 'success');
                // this.router.navigate(['/']);
                Promise.resolve(u);
              } else {
                return Promise.reject('Transaction aborted by the server');
              }
            });
          });
        }
      }).render('#paypal-button-container');
    });
  }

  /** Load Paypal buttons script programatically */
  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  /** Logic to convert the time range into 15 minutes slots */
  parseTime(s) {
    const c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  convertHours(mins) {
    const hour = Math.floor(mins / 60);
    const minuntes = mins % 60;
    const converted = this.pad(hour, 2) + ':' + this.pad(minuntes, 2);
    return converted;
  }

  pad(str, max) {
    str = str.toString();
    return str.length < max ? this.pad('0' + str, max) : str;
  }

  calculate_time_slot(startTime, endTime, interval) {

    const timeSlots = new Array();
    for (let i = startTime; i <= endTime; i = i + interval) {
      const formattedTime = this.convertHours(i);
      timeSlots.push(formattedTime);
    }
    return timeSlots;
  }

  /** Logic to convert the time range into 15 minutes slots ends here */

  /** When the slot is selected set the from and to time based on the selection */
  selectSlot(slot, i, last = false) {
    if (last) {
      this.selectedFromSlot = this.slots[i - 1];
      this.selectedToSlot = slot;
    } else {
      this.selectedFromSlot = slot;
      this.selectedToSlot = this.slots[i + 1];
    }

    /** If slot is selected then only allow user to make payment */
    if (!this.showPaypal && this.data.post.price >= 1) {
      this.showPaypal = true;
      this.loadPaypal();
    }
  }

}
