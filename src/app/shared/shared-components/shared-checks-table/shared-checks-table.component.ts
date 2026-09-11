import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { CartService } from 'src/app/api-services/cart.services';
import { HelperService } from 'src/app/api-services/helper.services';
import { HomePageService } from 'src/app/api-services/home-page.services';
import { ToasterService } from 'src/app/api-services/toaster.services';
import { getPortalPath, portalPath } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/api-services/payment.services';

@Component({
  selector: 'shared-checks-table',
  templateUrl: './shared-checks-table.component.html',
  styleUrls: ['./shared-checks-table.component.scss'],
})
export class SharedChecksTableComponent implements OnInit, OnDestroy {
  @Input() serviceTypeId: any;
  @Input() forceCartMode: boolean = false;
    @Input() layout: 'card' | 'table' = 'card';
 
  // @Output() servicesPackagesdata = new EventEmitter<any[]>();
  servicesPackagesdata: any[];
  showOtherChecks: boolean = false;
  isLoadingOther: boolean = false;
  // serviceTypeId: number;
  islive: boolean = true;
  isloading: boolean = false;
  isLoading:boolean = false;
  serviceLists: any;
  selectedService: any[] = [];
  checksArr: any;
  isApiSuccess: boolean;
  tempServicesPackagesdata: any[];
  userRoleId: number;
  actionForm: FormGroup;
  // emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$';
  isSubmitted: boolean = false;
  selectedDialCode: string = 'IN';
  dialCodes: any = [{code: 'IN', dial_code: '+91'}];
  dialCode: string = '+91';
  walletpayReqInstant: any;
  isSpecial: Boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _home: HomePageService,

    private _cart: CartService,
    public _helper: HelperService,
    private _router: Router,
    private _toaster: ToasterService,
    private _fb: FormBuilder,
    private _payment: PaymentService
  ) { 
    this.actionForm = this._fb.group({
      Title: ['Mr', [Validators.required]],
      Name: ['',
        [
          Validators.required,
          Validators.pattern('^[A-Za-z]+( [A-Za-z]+)*$'),
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      MobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9][0-9]{9}$'),
         
        ],
      ],
      EmailId: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]@)[a-zA-Z0-9._-]+@(?![.-])(?!.*[.-]{2})[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ],
      ],
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
  
    this.actionForm.controls['Name'].setValue(value, { emitEvent: false });
  }
  ngOnDestroy(): void {
    this.islive = false;
  }
  ngOnInit(): void {
    if(this._router.url.includes('special')) this.isSpecial = true;
    this.userRoleId = Number(this._helper.getUserType);

    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
    this._payment.payWithoutWalletInstant.subscribe(
      (res: any) => {
        // if (res && res.pay) {
                if (res && res.pay && this.walletpayReqInstant) {
          this._payment.payWithoutWalletInstant.next({ pay: false });
          this.payViaWalletInstant();
        }
      }
    );
    // Cart clear hote hi saare +1 aur "already in cart" thappe reset
    this._cart.cartCleared.pipe(takeWhile(() => this.islive)).subscribe(() => {
      (this.servicesPackagesdata || []).forEach((item: any) => {
        (item.newPackageServices || []).forEach((el: any) => {
          el.qty = 0;
          el.addedToCart = false;
          el.new_price = 0;
        });
      });
    });
  }
  //   this._payment.payWithoutWalletInstant.subscribe(
  //     (res: any) => {
  //       // if (res && res.pay) {
  //               if (res && res.pay && this.walletpayReqInstant) {
  //         this._payment.payWithoutWalletInstant.next({ pay: false });
  //         this.payViaWalletInstant();
  //       }
  //     }
  //   );
  // }

  loadData() {
    if (this.serviceTypeId) {
      this.isloading = true;
      this._home
        .getServiceById(this.serviceTypeId.servicetype_id)
        .pipe(takeWhile(() => this.islive))
        .subscribe(
          (res: any) => {
            if (res && res.IsSuccess) {
              this.isloading = false;
              //@ts-ignore
              this.servicesPackagesdata = res.Data.filter(
                (e: any) => e.status
              ).map((el: any) => {
                let pack = el.packageServices.map((d: any) => {
                  return {
                    ...d,
                    isSelected: false,
                    oldPrice: d.service_price,
                    qty: 0,
                  };
                });
                return {
                  newPackageServices: pack,
                  ...el,
                  isSelected: false,
                };
              }).filter((d: any) => {
                if (this._helper.getClientId) {
                  return Number(d?.clientid) == Number(this._helper.getClientId)
                }
                else {
                  if(this._router.url.includes('special')){
                    return Number(d?.clientid) == 1
                  }
                  else{
                    return !d?.clientid
                  }
                  // return d?.clientid == ''

                }
              });
              this.tempServicesPackagesdata = this.servicesPackagesdata;
            } else {
              this.isloading = false;
            }
          },
          (err: any) => {
            this.isloading = false;
          }
        );
    }
  }
  incrementValue(
    e: any,
    qty: any,
    item: any,
    indx: number,
    i: number,
    isMultiple: boolean
  ) {
    if (this._helper.isLoggedIn && (this.userRoleId === 2 || this.serviceTypeId.servicetype_id === 9)) {
      if (++qty > 0) {
        e.preventDefault();
        this.servicesPackagesdata[i].newPackageServices[indx].qty = isMultiple
          ? qty
          : 1;
        this.servicesPackagesdata[i].newPackageServices[indx].new_price =
          qty * item.service_price;
      }
    } else {
      this.userRoleId === 4 && this.openAlert('Create your candidate');
    }
  }

  decrementValue(e: any, qty: any, item: any, indx: number, i: number) {
    if (--qty >= 0) {
      e.preventDefault();
      this.servicesPackagesdata[i].newPackageServices[indx].qty = qty;
      this.servicesPackagesdata[i].newPackageServices[indx].new_price =
        qty * item.service_price;
    }
  }

  toggleOtherChecks(item: any) {
    if (this.showOtherChecks) {
      item.newPackageServices = item.newPackageServices.filter(
        (el: any) => !el.isOtherCheck || el.qty > 0
      );
      this.showOtherChecks = false;
      return;
    }

    this.isLoadingOther = true;
    this._home
      .getAllActiveChecks()
      .pipe(takeWhile(() => this.islive))
      .subscribe(
        (res: any) => {
          this.isLoadingOther = false;
          const all = res?.Data || [];
          const already = new Set(
            item.newPackageServices.map((d: any) => Number(d.package_service_id))
          );
          const others = all
            .filter(
              (d: any) =>
                d.service_status &&
                !already.has(Number(d.package_service_id))
            )
            .map((d: any) => ({
              ...d,
              isSelected: false,
              oldPrice: d.service_price,
              qty: 0,
              isOtherCheck: true,
            }));
          item.newPackageServices = [...item.newPackageServices, ...others];
          this.showOtherChecks = true;
        },
        () => {
          this.isLoadingOther = false;
          this.openAlert('Could not load other checks. Please try again.');
        }
      );
  }
    buyNowAla(item: any) {
    if (item && item.newPackageServices.some((el: any) => el.qty > 0)) {
      const freshOnes = item.newPackageServices.filter((el: any) => el.qty > 0 && !el.addedToCart);
      if (!freshOnes.length) {
        this._toaster.showSuccessToast('Selected checks are already in your cart.');
        return;
      }
      item.isSelected = true;
      let newItem = {
        ...item,
        newPackageServices: freshOnes.map((d: any) => {
          return {
            ...d,
            package_service_id: Array(d.qty).fill(d.package_service_id),
          };
        }),
      };
      this.addItemToCart(newItem, false, null, item);
  // buyNowAla(item: any) {
  //   if (item && item.newPackageServices.some((el: any) => el.qty > 0)) {
  //     item.isSelected = true;
  //     if (item.newPackageServices.some((el: any) => el.qty > 0)) {
  //       let newItem = {
  //         ...item,
  //         newPackageServices: item.newPackageServices
  //           .filter((el: any) => el.qty > 0)
  //           .map((d: any) => {
  //             return {
  //               ...d,
  //               package_service_id: Array(d.qty).fill(d.package_service_id),
  //             };
  //           }),
  //       };

  //       this.addItemToCart(newItem);
  //     } else {
  //       this.addItemToCart({
  //         ...item,
  //         newPackageServices: item.newPackageServices.filter(
  //           (el: any) => el.qty > 0
  //         ),
  //       });
  //     }

      // this._payment.createOrder(
      //   this.totalAmt,
      //   item.package_id,
      //   item.service_id,
      //   item.newPackageServices
      //     .filter((el: any) => el.isSelected)
      //     .map((d: any) => d.package_service_id)
      // );
    } else {
      // this.openAlert('Please choose any service!!', 'info');
      this.openAlert(
        this._helper.isLoggedIn
          ? 'Please select required checks and "Add to Cart" !!'
          : ''
      );
    }
  }
    addItemToCart(item: any, flag: boolean = false, pkgServiceId: any = null, sourceItem: any = null) {
  // addItemToCart(item: any, flag: boolean = false, pkgServiceId: any = null) {
    if (item) {
      item.isSelected = true;
      if (this._helper.isLoggedIn) {
        if (item) {
          // item.isSelected = true;
          const payload = {
            UserId: Number(this._helper.getUserId),
            ServiceId: item.service_id,
            PackageId: item.package_id,
            CartId: 0,
            PackageServiceId:
              flag && pkgServiceId
                ? pkgServiceId
                : item.newPackageServices
                  .map((d: any) => d.package_service_id)
                  .join(','),
            PackageServiceNameforMailUse: item?.newPackageServices.map((d: any) => d.service_name).join(','),
          };
          // this.callApiAddTocart(payload);
          this.callApiAddTocart(payload, sourceItem)
        }
        if (
          item &&
          item.alaCarte &&
          item.alaCarte.pkgId &&
          item.alaCarte.serviceIds?.length
        ) {
          const payload = {
            CartId: 0,
            ServiceId: item.service_id,
            PackageId: item.alaCarte.pkgId,
            PackageServiceId: item.alaCarte.serviceIds.join(','),
            UserId: Number(this._helper.getUserId),
          };
          this.callApiAddTocart(payload);
        }
      } else {
        this.openAlert();
        // this._helper.localStorageHandler(item);
      }
    }
  }
  callApiAddTocart(payload: any, sourceItem: any = null) {
    this._cart
      .addToCart(payload)
      .pipe(takeWhile(() => this.islive))
      .subscribe((res) => {

        if (res && res.IsSuccess) {
          if (sourceItem?.newPackageServices) {
            sourceItem.newPackageServices.forEach((el: any) => {
              if (el.qty > 0) el.addedToCart = true;
            });
          }
  // callApiAddTocart(payload: any) {
  //   this._cart
  //     .addToCart(payload)
  //     .pipe(takeWhile(() => this.islive))
  //     .subscribe((res) => {

  //       if (res && res.IsSuccess) {
  //         this.loadData();

          this.isApiSuccess = true;
          this._cart.isAddedInCart.next(true);

          this._toaster.showSuccessToast(res.Message);
          localStorage.removeItem('isReadyToBuy');
          localStorage.removeItem('cartItems');
        } else {
          this.isApiSuccess = false;
          this._toaster.showErrorToast(res.Message);
        }
      });
  }
  openAlert(title?: string) {
    Swal.fire({
      title: title ? title : 'Please Login to continue !!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      confirmButtonText: title ? 'Ok' : 'Login',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (title) {
          this.userRoleId === 4 &&
            (window.location.href = `${portalPath}/ulogged/case-initiation`);
        } else {
          this._router.navigate(['/auth']);
        }
      }
    });
  }
  // doDisable(isMultiple: boolean, val: string) {
  //   return !isMultiple && +val === 1;
  // }
  doDisable(isMultiple: boolean, val: any, max: any) {
    if(!isMultiple){
      if(val <= 0) return false;
      else return true;
    } 
    else{
      if(val >= max) return true;
      else if(val < max) return false;
      else return true;
    }
  }
  askForSignup() {
    if (!this._helper.isLoggedIn) {
      this.openAlert('');
      return;
    }
    let title = '';
    this.userRoleId === 2 && (title = 'Please login as Corporate !!');
    this.userRoleId === 4 && (title = 'Please login as Individual !!');
    this.userRoleId === 1 && (title = 'Go to admin Portal !!');
    this._helper.askForSignup(this.userRoleId, title);
  }
  goToPortal() {
    if (!this._helper.isLoggedIn) {
      this.openAlert('');
      return;
    }
    if (this.userRoleId === 2) {
      const title = 'Please login as Corporate !!';
      this._helper.askForSignup(this.userRoleId, title);
    }
    this.userRoleId === 4 &&
      (window.location.href = `${portalPath}/ulogged/case-initiation`);
  }
  buyNowInstant(item: any) {
    if (item && item.newPackageServices.some((el: any) => el.qty > 0)) {
      this.isSubmitted = true;
      if (!this.actionForm.valid) {
        return;
      }
      item.isSelected = true;
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
    } else {
      this.openAlertInstant(
        this._helper.isLoggedIn
          ? 'Please select required checks and "Proceed to Pay / Checkout" !!'
          : ''
      );
    }
  }
  makePayment(item: any){
    let checkArr: any = item.newPackageServices;
    const isCheckSelected = checkArr.some((el: any) => el.qty);
    if (!isCheckSelected) {
      this.openAlert('Please select checks !!');
      return
    }
    const user = this._helper.user;
    let check = checkArr.filter((el: any) => el.qty).map((el: any) => [...Array(el.qty).fill(el.package_service_id)].join(","));
    let checkName = checkArr.filter((el: any) => el.qty).map((el: any) => [...Array(el.qty).fill(el.service_name)].join(","));
    let data = {
      ServiceId: 9,
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
    // this.walletpayReqInstant = payload;
    this.walletpayReqInstant = payload;
    try { localStorage.setItem('walletpayReqInstant', JSON.stringify(payload)); } catch (e) {}
    this.previewInformation(payload, checkArr, totalAmt);
    return;
  }

  previewInformation(payload: any, checks: any, totalAmt: any) {
    this.isLoading = true;
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
      this.isLoading = false;
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
        this.payWalletNow(res.data, promoCodeData);
      } else {
        this._toaster.showErrorToast("Payment could not be started. Please try again.");
      }
    }, () => {
      this.isLoading = false;
      this._toaster.showErrorToast("Payment could not be started. Please try again.");
    });
    // this._payment.addWallet(req).subscribe((res: any) => {
    //   if (res && res.is_success) {
    //     const promoCodeData = {
    //       Orderid: res?.data?.OrderId,
    //       Amt: totalAmt,
    //       Toamount: finalAmt,
    //       Codeapplicable: true,
    //       Copencodevalue: null,
    //       Finalvalue: finalAmt,
    //       Status: "1",
    //       createdate: null,
    //       Percentages: "10%",
    //     };
    //     this.isLoading = false;
    //     this.payWalletNow(res.data, promoCodeData);
    //   }
    // });
  }
  payWalletNow(orderObj: any, promoCodeData: any) {
    this.isLoading = true;
    var globalThis = this;
    const options = {
      key: orderObj.razorpayKey.trim(),
      amount: orderObj.RequestAmt,
      currency: orderObj.Currency,
      name: orderObj.Name,
      description: orderObj.description,
      // image: "https://securitasb2cweb.keycorp.in/assets/img/logo_b.png",
      image: "https://walsonsverify.com/assets/img/logo_b.png",
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
        color: "#031F30",
      },
      // theme: {
      //   color: "#3399cc",
      // },
    };
    var rzp1 = new this._payment.nativeWindow.Razorpay(options);
    rzp1.open();
    rzp1.on("payment.failed", function (response: any) {
    });
    this.isLoading = false;
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
  openAlertInstant(title?: string) {
    Swal.fire({
      title: title ? title : 'Please Login to continue !!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',

      confirmButtonText: 'OK',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  // payViaWalletInstant() {
  //   this._payment.createOrderForCandidate(this.walletpayReqInstant).subscribe((res: any) => {
  payViaWalletInstant() {
    if (this._payment.orderInProgress) return;
      // ADD — dobara na chale
    this._payment.orderInProgress = true;
    // Razorpay ke async flow me component property (walletpayReqInstant) kho sakti hai.
    // Isliye localStorage se recover karo agar property null ho.
    if (!this.walletpayReqInstant) {
      try {
        const saved = localStorage.getItem('walletpayReqInstant');
        if (saved) this.walletpayReqInstant = JSON.parse(saved);
      } catch (e) {}
    }
        if (!this.walletpayReqInstant || !this.walletpayReqInstant.cartReq) {
      this._payment.orderInProgress = false;   // ADD — warna retry hamesha block
      this._toaster.showErrorToast('Order details not found. Please try again.');
      return;
    }
    // this._payment.createOrderForCandidate(this.walletpayReqInstant).subscribe((res: any) => {
    //   if (res.is_success) {
    //     let reqBody = {
          this._payment.createOrderForCandidate(this.walletpayReqInstant).subscribe((res: any) => {
      if (res.is_success) {
        this._payment.orderInProgress = false;        try { localStorage.removeItem('walletpayReqInstant'); } catch (e) {}
        let reqBody = {
          SLA_Start_Date: null,
          SLA_Due_Date: null,
          Closure_Date: null,
          UserId: Number(this._helper.getUserId),
          OrderId: res.OrderId,
          UpdatedBy: Number(res.CandidateId),
          Updatedtype: "User",
          Status: 1,
          Final_Submit: true,
          submittedBy: "User",
          isInstantVerify: true,
        }
        this._toaster.showSuccessToast(
          "Order created successfully. Please complete the candidate details to proceed."
        );
        setTimeout(() => {
          window.location.href = `${portalPath}/my-orders?key=${encodeURIComponent(res.OrderId)}&auto=1`;
        }, 400);

     } else {
        this._payment.orderInProgress = false;   // ADD
        this._toaster.showErrorToast(res.message);
      }
    }, (err: any) => {
      this._payment.orderInProgress = false;     // API error pe bhi flag reset
      this._toaster.showErrorToast('Something went wrong. Please try again.');
    });
  }
  submitData(payload: any){
    let personalPayload = {
      UserName: "",
      CandidateName: this.walletpayReqInstant?.Candidate?.candidate_name,
      Gender: this.walletpayReqInstant?.Candidate?.gender,
      MobileNo: this.walletpayReqInstant?.Candidate?.phone,
      DateOfBirth: "1900-01-01 00:00:00.000",
      EMailID: this.walletpayReqInstant?.Candidate?.email,
      Title: this.walletpayReqInstant?.Candidate?.title,
      UniqueReferenceID: new Date().getTime(),
      Package_Name: "Package-Demo_All",
      OrderId: payload?.OrderId,
      UserId: payload?.UserId,
      CandidateId: payload?.UpdatedBy,
      DateOfJoining: "NA",
      AdharNumber: "",
      AlternateMobileNumber:"",
      Designation:"",

      EmployeeID: "",
      FatherName: "",
      IndividualType: "self",
      IsDigitalScribbleSign:false,
      PanNumber: "",
      PlaceOfJoining:"",
      SignDigitallyUploadLetter:"",
      UAN_Number:"",
      UploadFileNameActual:"",
      UploadLetter:"",
    }
    this._payment.savePersonalPage(personalPayload).subscribe((res: any) => {
      if(res?.IsSuccess){
        let fullReqBody = [];
        let selectedChecks = this.servicesPackagesdata[0]?.newPackageServices.filter((val: any) => val?.qty > 0);
        let seqNo = 1;
        let columnsValue: any = {
          CandidateName: this.walletpayReqInstant?.Candidate?.candidate_name,
          Email: this.walletpayReqInstant?.Candidate?.email,
          MobileNo: this.walletpayReqInstant?.Candidate?.phone,
        }
        for(let check of selectedChecks){
          let colVal = columnsValue;
          if(check?.service_name === 'Court Record Check') colVal["AddressType"] = "Current Address";
          else if(check?.service_name === 'Face Match'){
            colVal["Image"] = "";
            colVal["CardImage"] = "";
          }
          let body: any = {
            CandidateId: payload?.UpdatedBy,
            UserId: payload?.UserId,
            OrderId: payload?.OrderId,
            SubmittedBy: "User",
            CartId: payload?.OrderId?.split('_')[1],
            CreatedBy: payload?.UserId,
            SubmitStatus: 2,
            isAadharNumberValid: false,
            ColumnsName: check?.service_name.replaceAll(/([^\w]+|\s+)/g,""),
            ColumnsNameValue: JSON.stringify(colVal),
            CheckId: check?.Package_service_Code,
            SeqNo: seqNo,
            Sub_SeqNo: 1,
            PackageServiceId: check?.package_service_id,
          };
          if(check?.service_name === 'Face Match') body["isInstantCheck"] = true;
          fullReqBody.push(body);
          seqNo++;
        }
        this._payment.saveAllChecks(fullReqBody).subscribe({
          next: responses => {
            this._payment.updateOrderStatus(payload).subscribe((res: any) =>{
              window.location.reload();
            });
          },
        });
      }
    })
  }
}
