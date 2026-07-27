export interface signUp {
  Prefix: String | null;
  FName: String | null;
  LName: String | null;
  MName: String | null;
  companyInfo: companyInfo;
  Email: String | null;
  UserName: String | null;
  Password: String | null;
  RoleID: boolean;
  Phone: String | null;
  Address1: String | null;
  Address2: String | null;
  District: String | null;
  State: String | null;
  Pincode: String | null;
  Designation: String | null;
  VarificationFor: String | null;
  IsAddressSame: boolean;
  IsAgreement: boolean;
}
export interface companyInfo {
  CompanyName?: String | null;
  CompanyEmail?: String | null;
  CompanyPhone?: String | null;
  CompanyGST?: String | null;
  CompanyAddress1?: String | null;
  CompanyAddress2?: String | null;
  CompanyDistrict?: String | null;
  CompanyState?: String | null;
  CompanyPincode?: String | null;
  CompanyCountry?: String | null;
  CompanyIndustry?: String | null;
  ExpectedCases?: String | null;
  SpecialRequirement?: String | null;
}
