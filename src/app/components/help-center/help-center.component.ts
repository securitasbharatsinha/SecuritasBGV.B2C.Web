import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/api-services/helper.services';
import { data, requiredCorFields, requiredIndFields } from './data';
import { industries } from '../check-for-industry/industry';
import { CartService } from 'src/app/api-services/cart.services';
import { takeWhile } from 'rxjs/operators';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { CustomValidators } from 'src/app/auth/custom-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss'],
})
export class HelpCenterComponent implements OnInit, OnDestroy {
  actionForm: FormGroup;
  isLoggedIn: boolean = false;
  loggedInUser: any = null;
  user: any = null;
  data: any;
  industries = industries;
  // emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$';
  selectedFile = null;
  isLive: boolean = true;
  b64Value: string;
  loggedInUserType: any;
  requiredCorFields = requiredCorFields;
  requiredIndFields = requiredIndFields;
  isSpecialWindow: any;
  isLoading: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _helper: HelperService,
    private _cart: CartService,
    private _toaster: ToasterService,
    private _router: Router
  ) {
    this.actionForm = this._fb.group({
      UserType: ['', Validators.required],
      queryType: ['', Validators.required],
      query: ['', Validators.required],
      name: ['',
        [
          Validators.required,
          Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$'),
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]{9}$'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]@)[a-zA-Z0-9._-]+@(?![.-])(?!.*[.-]{2})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      industryType: [''],
      employeeStrength: '',
      remarks: '',
      trackId: [''],
      securitasId: [''],
    });
  }
  onNameInput(event: any) {
    let value = event.target.value;
  
    // Allow only alphabets & space
    value = value.replace(/[^a-zA-Z ]/g, '');
  
    // Remove multiple spaces
    value = value.replace(/\s+/g, ' ');
  
    // Trim left space
    value = value.replace(/^\s+/, '');
  
    // Capitalize each word
    value = value
      .split(' ')
      .map((word: string) =>
        word ? word[0].toUpperCase() + word.substring(1).toLowerCase() : ''
      )
      .join(' ');
  
    this.actionForm.controls['name'].setValue(value, { emitEvent: false });
  }
 
  ngOnDestroy(): void {
    this.isLive = false;
  }
  resetQuery() {
    this.actionForm.get('query')?.patchValue('');
  }
  ngOnInit(): void {
    this.isSpecialWindow = this._router.url.includes('special');

    this._helper.isLoggedIn &&
      this._helper.uDetails?.subscribe((res: any) => {
        if (res) {
          this.actionForm.patchValue({
            name: `${res?.Prefix} ${res?.FName}${
              res?.MName ?? '' + res?.MName
            } ${res?.LName}`,
            phone: res?.Phone,
            email: res?.Email,
          });
        }
      });

    this.loggedInUser = this._helper.getUserId;
    this.loggedInUserType = this._helper.getUserType;
    this.isLoggedIn = this._helper.isLoggedIn;

    if (this.loggedInUserType) {
      this.loggedInUserType == 4 &&
        (this.actionForm.get('UserType')?.patchValue('corporate'),
        (this.data = data.find(
          (el) => el.login === this.isLoggedIn && el.UserType === 'corporate'
        )));
      this.loggedInUserType == 2 &&
        (this.actionForm.get('UserType')?.patchValue('individual'),
        (this.data = data.find(
          (el) => el.login === this.isLoggedIn && el.UserType === 'individual'
        )));
      this.actionForm.get('UserType')?.disable();
    }
    this.actionForm.controls.UserType.valueChanges.subscribe((res: any) => {
      this.data = data.find(
        (el) => el.login === this.isLoggedIn && el.UserType === res
      );
    });
    if (this.isLoggedIn) {
      this.actionForm.controls.query.valueChanges.subscribe((res: any) => {
        if (
          this.loggedInUserType == 4 &&
          this.requiredCorFields.includes(res)
        ) {
          this.actionForm.get('trackId')?.setValidators([Validators.required]);
          this.actionForm.get('trackId')?.updateValueAndValidity();
        } else {
          this.actionForm.get('trackId')?.clearValidators();
          this.actionForm.get('trackId')?.updateValueAndValidity();
        }
        if (
          this.loggedInUserType == 2 &&
          this.requiredIndFields.includes(res)
        ) {
          this.actionForm
            .get('securitasId')
            ?.setValidators([Validators.required]);
          this.actionForm.get('securitasId')?.updateValueAndValidity();
        } else {
          this.actionForm.get('securitasId')?.clearValidators();
          this.actionForm.get('securitasId')?.updateValueAndValidity();
        }
      });
    }
  }
  postFrom() {
    if (this.actionForm.valid) {
    this.isLoading = true;
      const data = {
        ...this.actionForm.value,
        file: this.b64Value ?? '',

        UserId: Number(this._helper?.getUserId) ?? 0,
        ...(this.loggedInUserType == 2 && { UserType: 'individual' }),
        ...(this.loggedInUserType == 4 && { UserType: 'corporate' }),
      };

      this._cart
        .needSupport(data)
        .pipe(takeWhile(() => this.isLive))
        .subscribe((res) => {
          if (res && res.is_success) {
            this.isLoading = false;
            this.actionForm.reset();
            this.selectedFile = null;
            this.b64Value = '';
            this._toaster.showSuccessToast(res.message);
          } else {
            this.isLoading = false;
            this._toaster.showErrorToast(res.message);
          }
        });
    } else {
      this.actionForm.markAllAsTouched();
    }
  }

  async uploadFile(e: any) {
    const type = `.${e.target.files[0].name.split('.').pop()}`;

    if (type === '.pdf' || type === '.png' || type === '.jpg') {
      this.selectedFile = e.target.files[0].name;
      const file: any = await this.convertToBase64(e.target.files[0]);
      this.b64Value = file.replace(/^(.*?),/gm, '');
    } else {
      this._toaster.showErrorToast('Invalid file type.');
    }
  }
  convertToBase64(file: any) {
    return new Promise((resolve, reject) => {
      //Read File
      var selectedFile = file;
      //Check File is not Empty
      if (selectedFile) {
        // Select the very first file from list
        var fileToLoad = selectedFile;
        // FileReader function for read the file.
        var fileReader = new FileReader();
        var base64;
        // Onload of file read the file content
        fileReader.onload = function (fileLoadedEvent) {
          base64 = fileLoadedEvent?.target?.result;
          resolve(base64);
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
      }
    });
  }

  onInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.actionForm.controls['phone'].setValue(value, { emitEvent: false });
    event.target.value = value;
  }

}
