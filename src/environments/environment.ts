// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
// export const apiEndPoint = 'https://b2cbackend.keycorp.in';
export const walsonsApiEndPoint = 'https://api.weverifyglobal.com/';
// export const walsonsApiEndPoint = 'https://apiwalsonsone.weverifyglobal.com/';

// live URL
export const apiEndPoint = 'https://api.walsonsverify.com';
// local backend URL
// export const apiEndPoint = 'https://localhost:44364';

export const hostEndPoint = 'https://b2cbackend.keycorp.in';
// export const COOKIE_DOMAIN = 'keycorp.in';
export const COOKIE_DOMAIN = 'walsonsverify.com';
// export const portalPath = 'https://securitasb2cwebadmin.keycorp.in';
// export const portalPath = 'https://www.walsonsverify.com:5002';
export const portalPath = 'https://admin.walsonsverify.com/#';
export const ApiBase = 'https://api.weverifyglobal.com';
export const api = (path: string) => {
  return `${ApiBase}/${path}`;
};
export const getPortalPath = (orderId: string = '') => {
  // return `${portalPath}/ulogged/order/active-order?order=${orderId}`;
  return `${portalPath}/dashboard`;
};
export const getPortalinvoice = (orderId: string) => {
  return `${portalPath}/ulogged/payments`;
};
export const getPortalFinanceHead = (orderId: string) => {
  return `${portalPath}/ulogged/stop-check/approval`;
};
export const getPortalSanction = (orderId: string) => {
  return `${portalPath}/ulogged/sanction-report`;
};
export const postpaidUsers = [4, 'postpaid'];
export const RAZORPAY_KEY_ID = 'rzp_test_VGvtRbPgI151iI';
export const RAZORPAY_SECRET_KEY = 'vCQtjCmHPh1BRR1kNqC5vQK4';
export const reCaptcha_SITE_KEY = '6Ldps44jAAAAAFp-17LUBfFexuwQNz6-fPIOpCHH';
export const reCaptcha_SECRET_KEY = '6Ldps44jAAAAAE_fVjUxBTdveChc6qIiO5rKFElu';
export const resendCodeTimer = 60;
export const financeUserId = 5;
export const financeHeadUserId = 6;
export const sanctionUserId = 7;
export const clientRoleId = 8;
export const genSxty = 1;
export const individualId = 2;
export const corporateId = 4;
