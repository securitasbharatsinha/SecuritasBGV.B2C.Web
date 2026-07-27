import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckForIndustryComponent } from './check-for-industry.component';

const routes: Routes = [
  { path: '', component: CheckForIndustryComponent ,
 
// children:[
//   {
//     path: 'agriculture-and-allied-industries',
//     loadChildren: () =>
//       import(
//         './components/agriculture-and-allied-industries/agriculture-and-allied-industries.module'
//       ).then((m) => m.AgricultureAndAlliedIndustriesModule),
//   },
//   {
//     path: 'service',
//     loadChildren: () =>
//       import('./components/service/service.module').then(
//         (m) => m.ServiceModule
//       ),
//   },
//   {
//     path: 'bfsi',
//     loadChildren: () =>
//       import('./components/bfsi/bfsi.module').then((m) => m.BfsiModule),
//   },
//   {
//     path: 'healthcare',
//     loadChildren: () =>
//       import('./components/healthcare/healthcare.module').then(
//         (m) => m.HealthcareModule
//       ),
//   },
//   {
//     path: 'infrastructure-and-transportation',
//     loadChildren: () =>
//       import(
//         './components/infrastructure-and-transportation/infrastructure-and-transportation.module'
//       ).then((m) => m.InfrastructureAndTransportationModule),
//   },
//   {
//     path: 'energy',
//     loadChildren: () =>
//       import('./components/energy/energy.module').then((m) => m.EnergyModule),
//   },
//   {
//     path: 'msme-and-gig-economy',
//     loadChildren: () =>
//       import(
//         './components/msme-and-gig-economy/msme-and-gig-economy.module'
//       ).then((m) => m.MsmeAndGigEconomyModule),
//   },
//   {
//     path: 'consumer-and-industrial-goods',
//     loadChildren: () =>
//       import(
//         './components/consumer-and-industrial-goods/consumer-and-industrial-goods.module'
//       ).then((m) => m.ConsumerAndIndustrialGoodsModule),
//   },
//   {
//     path: 'tourism-and-hospitality',
//     loadChildren: () =>
//       import(
//         './components/tourism-and-hospitality/tourism-and-hospitality.module'
//       ).then((m) => m.TourismAndHospitalityModule),
//   },
//   {
//     path: 'it',
//     loadChildren: () =>
//       import('./components/it/it.module').then((m) => m.ItModule),
//   },
// ]
},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckForIndustryRoutingModule {}
