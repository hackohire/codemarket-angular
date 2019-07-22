import { Injectable } from '@angular/core';
import Swal, { SweetAlertType } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }

  public success(title: string, message?: string, type?: SweetAlertType) {
    Swal.fire(title, '', type);
  }
}
