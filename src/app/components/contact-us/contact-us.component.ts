import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { ToasterService } from 'src/app/api-services/toaster.services';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  contactForm: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _homepageServices: HomePageService,
    private _toaster: ToasterService

  ) { }

  ngOnInit(): void {
    this.contactForm = this._fb.group({
      Name: ['', [Validators.required, Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')]],
      SurName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')]],
      Email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]@)[a-zA-Z0-9._-]+@(?![.-])(?!.*[.-]{2})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      Phone: ['', [
        Validators.required,
        Validators.pattern('^[6-9][0-9]{9}$'),
        Validators.maxLength(10),
        Validators.minLength(10)
      ]],
      Message: ['', [Validators.required]]
    });
  }

  onNameInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/[^a-zA-Z ]/g, '');
    value = value.replace(/\s+/g, ' ');
    value = value.replace(/^\s+/, '');
    value = value
      .split(' ')
      .map((word: string) =>
        word ? word[0].toUpperCase() + word.substring(1).toLowerCase() : ''
      )
      .join(' ');
    this.contactForm.controls['Name'].setValue(value, { emitEvent: false });
  }

  onSurnameInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/[^a-zA-Z ]/g, '');
    value = value.replace(/\s+/g, ' ');
    value = value.replace(/^\s+/, '');
    value = value
      .split(' ')
      .map((word: string) =>
        word ? word[0].toUpperCase() + word.substring(1).toLowerCase() : ''
      )
      .join(' ');
    this.contactForm.controls['SurName'].setValue(value, { emitEvent: false });
  }

  onInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.contactForm.controls['Phone'].setValue(value, { emitEvent: false });
    event.target.value = value;
  }

  sendMessage(): void {
    this.isSubmitted = true;
    if (this.contactForm.valid) {
      this._homepageServices.saveContactUs(this.contactForm.value).subscribe(
        (res: any) => {
          if (res && res.IsSuccess) {
            this._toaster.showSuccessToast(res.Message);
            this.contactForm.reset();
            this.isSubmitted = false;
          }
        },
        (err: any) => {
          this._toaster.showErrorToast('Something went wrong. Please try again.');
        }
      );
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
