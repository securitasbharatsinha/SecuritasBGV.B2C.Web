export const technical = [
  'Unable to sign-up/login',
  'Code not received',
  'Issue with captcha code',
  'Can not reset password​',
  'Other',
];
export const salesIndividual = [
  'Product related query',
  'Partner with us',
  'Other',
];
export const salesCorporate = [
  'Services',
  'Partner with us',
  'Schedule a call/demo',
  'Other',
];
export const Cservices = [
  'Unable to register',
  'Stop case',
  'Request to prioritize',
  'Cannot find my case',
  'Reverification',
  'Other',
];
export const Iservices = [
  'Cannot register case',
  'Stop case',
  'Reverification a case/ check',
  'Reverification',
  'Cannot find the case',
  'Other',
];
export const Cfinance = [
  'Invoice',
  'Issue in payment​',
  'Want payment proof​',
  'Other',
];
export const Ifinance = [
  'Invoice',
  'Issue in payment​',
  'Want payment proof​',
  'Costing-related',
  'Other',
];

export const data = [
  {
    login: false,
    UserType: 'individual',
    queryType: ['Sales', 'Technical support'],
    'Technical support': technical,
    Sales: salesIndividual,
  },
  {
    login: false,
    UserType: 'corporate',
    queryType: ['Sales', 'Technical support'],
    'Technical support': technical,
    Sales: salesCorporate,
  },
  {
    login: true,
    UserType: 'individual',
    queryType: ['Sales', 'Technical support', 'Services', 'Finance'],
    'Technical support': technical,
    Sales: salesIndividual,
    Services: Iservices,
    Finance: Ifinance,
  },
  {
    login: true,
    UserType: 'corporate',
    queryType: ['Sales', 'Technical support', 'Services', 'Finance'],
    'Technical support': technical,
    Sales: salesCorporate,
    Services: Cservices,
    Finance: Cfinance,
  },
];

export const requiredCorFields = [
  'Stop case',
  'Request to prioritize',
  'Cannot find my case',
  'Reverification',
  'Invoice',
  'Want payment proof',
];
export const requiredIndFields = [
  'Stop case',
  'Reverification a case/ check',
  'Reverification',
  'Invoice',
  'Want payment proof',
];
