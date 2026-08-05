import {Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HelperService } from 'src/app/api-services/helper.services';
import { PaymentService } from 'src/app/api-services/payment.services';

@Component({
  selector: 'app-individual2',
  templateUrl: './individual2.component.html',
  styleUrls: ['./individual2.component.scss'],
})
export class Individual2Component implements OnInit {
  currentURL: string;
  instantChecks: any[] = [];
  actionForm: FormGroup;
  selectedDialCode: string = 'IN';
  dialCodes: any = [{code: 'IN', dial_code: '+91'}];
  isSubmitted: boolean = false;
  walletpayReqInstant: any;

  servicePagesData: any = {
    '/verify-yourself': {
      title: 'Self Verification',
      img1: '../../../assets/img/Self-Verification-updated.png',
      img2: '../../../assets/img/Self-Verification-image.png',
      heading1: {
        p1: 'Verify Yourself',
        p2: 'In Minutes, Not Days',
        p3: '',
        p4: ''
      },
      heading2: {
        p1: 'Verify your identity, employment,',
        p2: 'court records, address, credit',
        p3: 'history, and more,',
        p4: 'so you can spot fraud, uncover identity',
        p5: 'misuse, and stay in control with confidence.',
      },
      heading3: {
        p1: 'Spot issues early',
        p2: 'Prepare for screening',
        p3: 'Build trust with employers/landlords',
        p4: 'Reduce onboarding delays',
        p5: 'Protect against identity misuse',
      },
    },
    '/helper-verification': {
      title: 'Domestic Help Verification',
      img1: '../../../assets/img/Helper-Verification-updated.png',
      img2: '../../../assets/img/Helper-Verification-image.png',
      heading1: {
        p1: 'Verify Domestic Help,',
        p2: 'Stay Safe At Home',
        p3: '',
        p4: ''
      },
      heading2: {
        p1: 'Verify maids, drivers, nannies,',
        p2: 'cooks, guards , home tutors and',
        p3: 'more, before hiring,',
        p4: 'through trusted background checks for',
        p5: 'safer homes and smarter hiring.',
      },
      heading3: {
        p1: 'Prevent unauthorized home access',
        p2: 'Prevent fraud risks',
        p3: 'Detect identity & address mismatches',
        p4: 'Reduce theft & fraud incidents',
        p5: '',
      },
    },
    '/tenant-verification': {
      title: 'Tenant Verification',
      img1: '../../../assets/img/Tenant-Verification-updated.png',
      img2: '../../../assets/img/Tenant-Verification-image.png',
      heading1: {
        p1: 'Verify Tenants,',
        p2: 'Rent Smarter',
        p3: '',
        p4: ''
      },
      heading2: {
        p1: 'Verify tenant identity, permanent',
        p2: 'address, credit check, previous',
        p3: 'landlord feedback, and more,',
        p4: 'so you can spot red flags, eliminate',
        p5: 'rental risks & rent with full confidence.',
      },
      heading3: {
        p1: 'Mitigates risk of tenant related frauds',
        p2: 'Confirms employment details',
        p3: 'Screens reliable tenants',
        p4: 'Reduces Rental decisions that are hard to reverse',
        p5: '',
      },
    },
    '/matrimonial-due-diligence': {
      title: 'Matrimonial Verification',
      img1: '../../../assets/img/Matrimonial-Verification-updated.png',
      img2: '../../../assets/img/Matrimonial-Verification-image.png',
      heading1: {
        p1: 'Verify Your Match,',
        p2: 'Before You Decide',
        p3: '',
        p4: ''
      },
      heading2: {
        p1: 'Verify partner identity, employment,',
        p2: 'court records, marital history,',
        p3: 'and more,',
        p4: 'So you can avoid surprises, uncover red',
        p5: 'flags & make informed life decisions.',
      },
      heading3: {
        p1: 'Avoid hidden personal risks',
        p2: 'Verify identity and background',
        p3: 'Build trust before commitment',
        p4: 'Validate Employment & Lifestyle Credibility',
      },
    },
    '/instant-verify': {
      title: 'Instant Verification',
      img1: '../../../assets/img/Instant-Verification-updated.png',
      img2: '../../../assets/img/Instant-Verification-image.png',
      heading1: {
        p1: 'Verify Your Identity Instantly,',
        p2: 'With Confidence',
        p3: '',
        p4: ''
      },
      heading2: {
        p1: 'Verify your identity, employment,',
        p2: 'court records, address, credit history,',
        p3: 'and more,',
        p4: 'So you can spot fraud, uncover identity',
        p5: 'misuse, and stay in control with confidence.',
      },
      heading3: {
        p1: 'Instant results, no waiting',
        p2: 'Enables Faster Decision-Making',
        p3: 'Reduces verification delays',
        p4: 'Improves decision confidence',
        p5: '',
      },
    }
  }
  constructor(
    private _router: Router,
    private _homepageService: HomePageService,
    private _fb: FormBuilder,
    public _helper: HelperService,
    private _payment: PaymentService,
  ) {
      this.currentURL = this._router.url;
      this.actionForm = this._fb.group({
        Title: ['Mr', [Validators.required]],
        Name: ['',[Validators.required,Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$'),Validators.minLength(3),Validators.maxLength(30)]],
        MobileNumber: ['',[Validators.required,Validators.pattern('^[6-9][0-9]{9}$')]],
        EmailId: ['',[Validators.required,Validators.email,Validators.pattern(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]@)[a-zA-Z0-9._-]+@(?![.-])(?!.*[.-]{2})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      });
   }

  ngOnInit(): void {
    this.getInstantChecks();
  }

  quantity1: number = 0;
  quantity7: number = 0;
  quantity8: number = 0;
  quantity9: number = 0;
  quantity10: number = 0;

  incDecQty2(type: any, index: any){
    if(!this._helper.isLoggedIn){
      this.openLoginAlert();
    }
    else if(type === 'inc'){
      this.instantChecks[0].newPackageServices[index].qty = 1;
    }
    else if(type === 'dec'){
      this.instantChecks[0].newPackageServices[index].qty = 0;
    }
  }

  incDecQty(type: any, check: any){
    if(type === 'inc'){
      (this as any)[check] = (this as any)[check] >= 10 ? 10 : (this as any)[check] + 1;
    }
    else if(type === 'dec'){
      (this as any)[check] = (this as any)[check] > 0 ? (this as any)[check] - 1 : 0;
    }
  }

  getInstantChecks() {
    this._homepageService.getServiceById(9).subscribe((res: any) => {
      if (res && res?.IsSuccess) {
        this.instantChecks = res?.Data?.map((el: any) => {
          const pack = el.packageServices?.map((d: any) => ({
            ...d,
            oldPrice: d.service_price,
            qty: 0,
          })) || [];
          return {
            ...el,
            packageServices: pack,
            newPackageServices: pack,
          };
        }) || [];
        // console.log(this.instantChecks, '======================')
      }
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
    
    this.actionForm.controls['Name'].setValue(value, { emitEvent: false });
  }

  onInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.actionForm.controls['MobileNumber'].setValue(value, { emitEvent: false });
    event.target.value = value;
  }

  openLoginAlert() {
    Swal.fire({
      title: 'Please Login to continue !!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      confirmButtonText: 'Login',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      customClass: {
        title: 'small-swal-title' 
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._router.navigate(['/auth/login'], { fragment: this.currentURL });
      }
    });
  }

  instantCheckSelected(){
    return this.instantChecks[0]?.newPackageServices?.some((el: any) => el?.qty > 0)
  }
  
  buyNowInstant(item: any) {
    return
    if(!this._helper.isLoggedIn){
      this.openLoginAlert()
    }
    else{
      this.isSubmitted = true;
      if (!this.actionForm.valid) {
        return;
      }
      let newItem = {
        ...item,
        newPackageServices: item.newPackageServices
          .filter((el: any) => el.qty > 0)
          .map((d: any) => {
            return {
              ...d,
              package_service_id: Array(d.qty).fill(d.package_service_id),
            };
          }),
      };
      this.makePayment(newItem);
    }
  }

  makePayment(item: any){
    let checkArr: any = item.newPackageServices;
    const user = this._helper.user;
    let check = checkArr.filter((el: any) => el.qty).map((el: any) => [...Array(el.qty).fill(el.package_service_id)].join(","));
    let checkName = checkArr.filter((el: any) => el.qty).map((el: any) => [...Array(el.qty).fill(el.service_name)].join(","));
    let data = {
      ServiceId: 6,
      PackageId: 42,
      PackageServiceId: check.join(","),
      PackageServiceNameforMailUse: checkName.join(","),
      UserId: user.Id,
    };
    let totalAmt = checkArr.filter((el: any) => el.qty).reduce((acc: any, curr: any) => {
        return acc + curr.new_price;
    }, 0);

    const payload = {
      Candidate: {
        title: this.actionForm.value?.Title,
        Issendnotification: false,
        candidate_name: this.actionForm.value?.Name,
        gender: this.actionForm.value?.Title === 'Mr' ? 'Male' : this.actionForm.value?.Title === 'Ms' ? 'Female' : 'Other',
        email: this.actionForm.value?.EmailId,
        Employee_Id: null,
        phone: this.actionForm.value?.MobileNumber,
        type: "other",
      },
      cartReq: { ...data, UserId: user.Id },
      PaymentReq: {
        amount: Math.round(totalAmt * 100),
        ...data,
        tokenId: "100001010101ffff",
        userId: user.Id,
        username: user.FName + " " + user.LName,
        email: user.Email,
        contact: user.Phone,
        address: user.Address1 || "-",
      },
      Description: "Instant Verification",
    };
    this.walletpayReqInstant = payload;
    this.previewInformation(payload, checkArr, totalAmt);
    return;
  }

    previewInformation(payload: any, checks: any, totalAmt: any) {
    // this.isLoading = true;
    let gstAmt = totalAmt * (18 / 100);
    let finalAmt = totalAmt + gstAmt;
    const user = this._helper.user;
    const req = [{
      Name: user.FName + " " + user.LName,
      Email: user.Email,
      Contact: user.Phone,
      Address: user.Address1 || "-",
      RequestAmt: Math.round(finalAmt * 100),
      description: "Requested Amount",
    }];
    this._payment.addWallet(req).subscribe((res: any) => {
      if (res && res.is_success) {
        const promoCodeData = {
          Orderid: res?.data?.OrderId,
          Amt: totalAmt,
          Toamount: finalAmt,
          Codeapplicable: true,
          Copencodevalue: null,
          Finalvalue: finalAmt,
          Status: "1",
          createdate: null,
          Percentages: "10%",
        };
        // this.isLoading = false;
        this.payWalletNow(res.data, promoCodeData);
      }
    });
  }

    payWalletNow(orderObj: any, promoCodeData: any) {
    // this.isLoading = true;
    var globalThis = this;
    const options = {
      key: orderObj.razorpayKey.trim(),
      amount: orderObj.RequestAmt,
      currency: orderObj.Currency,
      name: orderObj.Name,
      description: orderObj.description,
      image: "https://securitasb2cweb.keycorp.in/assets/img/logo_b.png",
      order_id: orderObj.OrderId,
      handler: function (response: any) {
        if (response) {
          // globalThis.promoCodeDetails && globalThis._payment.SavePromoCode(promoCodeData);
          globalThis._payment.walletPaymentInstant(response, orderObj.OrderId);
        }
      },
      prefill: {
        name: orderObj.name,
        email: orderObj.email,
        contact: orderObj.contact,
      },
      notes: {
        address: orderObj.address,
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new this._payment.nativeWindow.Razorpay(options);
    rzp1.open();
    rzp1.on("payment.failed", function (response: any) {
    });
    // this.isLoading = false;
  }

}