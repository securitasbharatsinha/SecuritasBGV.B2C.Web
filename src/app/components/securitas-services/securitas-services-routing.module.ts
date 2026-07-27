import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecuritasServicesComponent } from './securitas-services.component';

const routes: Routes = [
  {
    path: '',
    component: SecuritasServicesComponent,
    // children: [
    //   {
    //     path: '',
    //    redirectTo:'instant_verification'
    //   },
    //   {
    //     path: 'instant_verification',
    //     loadChildren: () =>
    //       import('./customer/instant-verify/instant-verify.module').then(
    //         (m) => m.InstantVerifyModule
    //       ),
    //   },
    //   {
    //     path: 'digital_verification',
    //     loadChildren: () =>
    //       import(
    //         './customer/digital-verification/digital-verification.module'
    //       ).then((m) => m.DigitalVerificationModule),
    //   },
    //   {
    //     path: 'helper_verification',
    //     loadChildren: () =>
    //       import(
    //         './customer/helper-verification/helper-verification.module'
    //       ).then((m) => m.HelperVerificationModule),
    //   },
    //   {
    //     path: 'tenant_verification',
    //     loadChildren: () =>
    //       import(
    //         './customer/tenant-verification/tenant-verification.module'
    //       ).then((m) => m.TenantVerificationModule),
    //   },
    //   {
    //     path: 'matrimonial_due_diligence',
    //     loadChildren: () =>
    //       import(
    //         './customer/matrimonial-due-diligence/matrimonial-due-diligence.module'
    //       ).then((m) => m.MatrimonialDueDiligenceModule),
    //   },
    //   {
    //     path: 'employee_verification',
    //     loadChildren: () =>
    //       import(
    //         './company/business-employee-verification/business-employee-verification.module'
    //       ).then((m) => m.BusinessEmployeeVerificationModule),
    //   },
    //   {
    //     path: 'leadership_due_diligence',
    //     loadChildren: () =>
    //       import(
    //         './company/leadership-due-diligence/leadership-due-diligence.module'
    //       ).then((m) => m.LeadershipDueDiligenceModule),
    //   },
    //   {
    //     path: 'vendor_due_diligence_(vdd)',
    //     loadChildren: () =>
    //       import(
    //         './company/vendor-due-diligence/vendor-due-diligence.module'
    //       ).then((m) => m.VendorDueDiligenceModule),
    //   },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecuritasServicesRoutingModule {}
