export const environment = { production: true };

export const apiEndPoint   = 'http://10.83.0.47:8080';
export const portalPath    = 'http://10.83.0.47:8081/#';

export const COOKIE_DOMAIN = '';
export const COOKIE_ATTRS  = 'path=/;';

export const walsonsApiEndPoint = 'https://api.weverifyglobal.com/';
export const hostEndPoint = 'https://b2cbackend.keycorp.in';
export const ApiBase = 'https://api.weverifyglobal.com';
export const api = (path: string) => `${ApiBase}/${path}`;

export const getPortalPath        = (orderId: string = '') => `${portalPath}/dashboard`;
export const getPortalinvoice     = (orderId: string) => `${portalPath}/ulogged/payments`;
export const getPortalFinanceHead = (orderId: string) => `${portalPath}/ulogged/stop-check/approval`;
export const getPortalSanction    = (orderId: string) => `${portalPath}/ulogged/sanction-report`;

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