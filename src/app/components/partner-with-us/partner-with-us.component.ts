import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { partnerusData } from 'src/app/api-interfaces/aboutUs';
import { subjects } from 'src/app/api-interfaces/home-page';
import { AboutusService } from 'src/app/api-services/aboutUs.services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { ToasterService } from 'src/app/api-services/toaster.services';

@Component({
  selector: 'app-partner-with-us',
  templateUrl: './partner-with-us.component.html',
  styleUrls: ['./partner-with-us.component.scss'],
})
export class PartnerWithUsComponent implements OnInit, OnDestroy {
  @ViewChild('file') fileInputVariable!: ElementRef;
  partnerUsForm: FormGroup;
  isLive: boolean = true;
  allSubjects: subjects[];
  fileName: any;
  partnerContent: partnerusData;
  isSubmitted: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _homepageService: HomePageService,
    private _about: AboutusService,
    private _toaster: ToasterService
  ) { }
  ngOnDestroy(): void {
    this.isLive = false
  }
  submitForm(){
    this.isSubmitted=true;
    if(this.partnerUsForm.invalid){
      return;
    }
    console.log(this.partnerUsForm.value);
  }
  ngOnInit(): void {
    this.loadData()
    this.partnerUsForm = this._fb.group({
      CompanyName: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9&.'\\- ]{2,100}$"), Validators.minLength(2), Validators.maxLength(100)]],
      Prefix: ['', [Validators.required]],
      Name: ['', [Validators.required, Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')]],
      SurName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$')]],
      Phone: ['', [Validators.required,
        Validators.pattern('^[6-9][0-9]{9}$'),]],
      Email: ['', [Validators.required, Validators.email,Validators.pattern(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]@)[a-zA-Z0-9._-]+@(?![.-])(?!.*[.-]{2})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      // SubjectId: ['', [Validators.required]],
      // Description: ['', [Validators.required]],
      Service: ['', [Validators.required]],
      Region: ['', [Validators.required]],
      SubjectId: [''],
      WorkCondition: [''],
      Description:['']
    });
    this._homepageService
      .getSubjectForPartner()
      .pipe(takeWhile(() => this.isLive))
      .subscribe((res: any) => {
        this.allSubjects = res.Data;
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
  
    this.partnerUsForm.controls['Name'].setValue(value, { emitEvent: false });
  }
  onSurnameInput(event: any) {
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
  
    this.partnerUsForm.controls['SurName'].setValue(value, { emitEvent: false });
  }
  onInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.partnerUsForm.controls['Phone'].setValue(value, { emitEvent: false });
    event.target.value = value;
  }

  loadData() {
    this._about.getPartnerusContent().pipe(takeWhile(() => this.isLive)).subscribe(res => {
      //@ts-ignore
      this.partnerContent = res.data as partnerusData
    })
  }

  filehandler($event: any) {
    const fileInput=$event.target;
  if(fileInput.files && fileInput.files.length>0){
    const file = fileInput.files[0];
    const allowedTypes = ['image/jpeg','image/png','application/pdf','application/zip'];
    const maxSize = 5*1024*1024; // it will take 5mb file max
 
    if(!allowedTypes.includes(file.type)){
      this._toaster.showErrorToast('Only JPG, PNG, PDF and ZIP files are allowed');
      fileInput.value='';
      this.fileName=null;
      return;
    }
 
    if(file.size>maxSize){
      this._toaster.showErrorToast('File size must be less than 5MB');
      fileInput.value='';
      this.fileName=null;
      return;
    }
 
    this.fileName=file;
 
  }else{
    this.fileName=null;
  }
  }
  saveForm() {
    if (this.partnerUsForm.valid) {
      const formData = new FormData();
      if (this.fileName) formData.append('FileInfo', this.fileName);
      for (const [k, v] of Object.entries(this.partnerUsForm.value)) {
        //@ts-ignore
        formData.append(k, v);
      }

      this._homepageService.savePartnerUs(formData).pipe(takeWhile(() => this.isLive)).subscribe((res: any) => {
        this._toaster.showSuccessToast('Your request has been submitted successfully!')
        this.partnerUsForm.reset()
        this.fileName = null;
        if (this.fileInputVariable) {
          this.fileInputVariable.nativeElement.value = "";
        }

      }, (err: any) => {

      });
    } else {
      this.partnerUsForm.markAllAsTouched();
    }
  }
  handleSpaceInput(event: any, controlName: string){
    let value = event.target.value;
    value = value.replace(/\s+/g, ' ');
    value = value.replace(/^\s+/, '');
 
    this.partnerUsForm.controls[controlName].setValue(value,{emitEvent:false});
  }
}
