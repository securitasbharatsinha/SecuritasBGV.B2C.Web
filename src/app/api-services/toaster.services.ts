import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor() {}

  showSuccessToast(
    text: string,
    position: any = 'top-end',
    timer: number = 4000
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position,
      timer,
      showConfirmButton: false,
      icon: 'success',
      timerProgressBar: true,
      text,
      customClass: {
        container: 'swal-alert-success',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire();
  }

  showErrorToast(
    text: string,
    position: any = 'top-end',
    timer: number = 4000
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position,
      timer,
      showConfirmButton: false,
      icon: 'error',
      timerProgressBar: true,
      text,
      customClass: {
        container: 'swal-alert-danger',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire();
  }

  showInfoToast(text: string, position: any = 'top-end', timer: number = 4000) {
    const Toast = Swal.mixin({
      toast: true,
      position,
      timer,
      showConfirmButton: false,
      icon: 'info',
      timerProgressBar: true,
      text,
      customClass: {
        container: 'swal-alert-info',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire();
  }

  successAlert(text: string, time: number = 2000, icon: any = 'success') {
    return Swal.fire({
      title: text,
      icon: icon,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',

      timer: time,

      allowOutsideClick: false,

      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    });
  }
}
