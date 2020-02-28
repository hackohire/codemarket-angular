import { Injectable } from '@angular/core';
import Swal, { SweetAlertType } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }

  public success(title: string, message?: string, type?: SweetAlertType) {
    Swal.fire(title, message, type);
  }

  public confirmDelete(callback) {
    Swal.fire({
      title: 'Are you sure?',
      // text: "But you will still be able to retrieve this file.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, Delete Permanetly!',
      cancelButtonText: 'No, cancel please!',
    }).then((y) => {
      if (y.value) {
        callback();
      }
    });
  }
}
