export const servicelist = {
  instant_verification: {
    services: [
      { id: 'i1', service: 'Aadhar Verifcation (With OTP)', price: 60 },
      { id: 'i2', service: 'Aadhar Verifcation (Without OTP)', price: 50 },
      { id: 'i3', service: 'Pan Verification', price: 60 },
      {
        id: 'i4',
        service: 'Driving License',
        price: 10,
        desc: `
      Driving licence is an official document issued by the Government of India, permitting individuals to operate or drive motorised vehicles. Using only the DL number, our API will extract all the updated and real time data from the database. Our API allows you to conduct verification of Driving Licenses for numerous business scenarios and establishing a fine tuned process with the least failure probability.
      `,
      },
      { id: 'i5', service: 'Voter ID', price: 40 },
      { id: 'i6', service: 'Face Match', price: 70 },
      {
        service: 'Bank Account Verification',
        price: 70,
        desc: `
      Bank Account verification API helps you confirm account validity. By accessing updated data and real-time authentication, the result such as the account holder’s name is fetched which will be exactly as it appears in bank records.
      `,
      },
    ],
    type: 'instant',
  },

  digital_verification: {
    services: [
      { id: 'd1', service: 'Digital Address Verification', price: 60 },
      { id: 'd2', service: 'Digital Employment Check', price: 50 },
      { id: 'd3', service: 'Global Database Check', price: 60 },
      { id: 'd4', service: 'Court Record Check', price: 10 },
      { id: 'd5', service: 'National Identity Check', price: 40 },
      { id: 'd6', service: 'Credit History Check', price: 70 },
      { id: 'd7', service: 'Facis Level III Check', price: 50 },
      { id: 'd8', service: 'Social Media Check', price: 80 },
    ],
    type: 'digital',
  },

  tenant_verification: {
    services: [
      {
        id: 't1',
        service: 'Tenant Verification',
        price: 350,
        subService: [
          'National ID Check',
          'Court Record Check',
          'Reference Check',
          'Digital Employment Check',
        ],
      },
    ],
    type: 'tenant',
  },

  helper_verification: {
    services: [
      {
        id: 'h1',
        service: 'Domestic Helper',
        price: 350,
        subService: [
          'National ID Check',
          'Court Record Check',
          'Reference Check',
        ],
      },
      {
        id: 'h2',
        service: 'Baby Sitter / Elderly Care Taker',
        price: 450,
        subService: [
          'National ID Check',
          'Court Record Check',
          'Reference Check',
          'Drug Test',
        ],
      },
      {
        id: 'h3',
        service: 'Driver',
        price: 300,
        subService: [
          'Driving License Check',
          'National ID Check',
          'Court Record Check on Current Address',
          'Court record check on Permanent Address',
          'Physical Current Address Verification',
          'Reference Check',
          'Drug Test',
        ],
      },
      {
        id: 'h4',
        service: 'Tution Teacher',
        price: 550,
        subService: [
          'Highest Qualification Check',
          'National ID Check',
          'Current Address Check',
          'Reference Check',
          'Court record check on Permanent Address',
        ],
      },
      { id: 'h5', service: 'Self', price: 300, subService: ['A la carte'] },
    ],
    type: 'helper',
  },

  employee_verification: {
    services: [
      { id: 'e1', service: 'Academic Record Check', price: 60 },
      { id: 'e2', service: 'Previous Employment Verificaiton', price: 50 },
      { id: 'e3', service: 'Residential Verification', price: 60 },
      { id: 'e4', service: 'ID Document Verficaiton', price: 10 },
      { id: 'e5', service: 'National Identity Check', price: 40 },
      { id: 'e6', service: 'Global Database Check', price: 70 },

      { id: 'e7', service: 'Social Media Check', price: 80 },
    ],
    type: 'employee',
  },
};
