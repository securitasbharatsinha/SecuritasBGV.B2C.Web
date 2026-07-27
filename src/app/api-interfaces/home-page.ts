export interface packages {
  IsSuccess?: boolean | null;
  Message?: string | null;
  Data?: singlePackage[] | null;
  ExMessage?: string | null;
}
export interface singlePackage {
  package_id: number;
  package_name?: string | null;
  description?: string | null;
  price: number;
  status?: boolean | null;
  bestseller?: boolean | null;
  created_by?: number | null;
  created_on?: string | null;
  modified_by?: number | null;
  modified_on?: string | null;
  offer?: string | null;
  icon: string;
  bg_color?: string;
  border_color?: string;
  fixedpackage: boolean;
  packageServices?: packageService[] | null;
}
export interface packageService {
  package_service_id?: number | null;
  package_master_id?: number | null;
  service_name?: string | null;
  service_description?: string | null;
  service_status?: boolean | null;
  created_by?: number | null;
  created_on?: string | null;
  modified_by?: number | null;
  modified_on?: string | null;
  service_price: number;
}

export interface testimonials {
  IsSuccess: boolean | null;
  Message: string | null;
  ExMessage: string | null;
  Data: singleTestimonial[] | null;
}
export interface singleTestimonial {
  client_id: number | null;
  client_name: string | null;
  description: string | null;
  designation: string | null;
  client_photo: string | null;
}
export interface services {
  IsSuccess: boolean | null;
  Message: string | null;
  ExMessage: string | null;
  Data:
    | {
        servicetype_id: number | null;
        service_name: string | null;
        service_description: string | null;
        roleid: number | null;
        service_icon: string | null;
        service_link: string;
        service_img: string;
        pic: string;
      }[]
    | null;
}

export interface buyPackages {
  PkgId: number | null;
  PkgSerId: string | null;
  TotalPrice: number | null;
  userDetails: {
    Id: number | null;
  };
}
export interface login {
  Email: string;
  Password: string;
}
export interface contactUs {
  Name: string;
  SurName: string;
  Email: string;
  Phone: string;
  Message: string;
}
export interface partnerUs {
  CompanyName: string;
  Prefix: string;
  Name: string;
  SurName: string;
  Phone: string;
  Email: string;
  SubjectId: number | null;
  Description: string;
  FileInfo: string;
}

export interface subjects {
  Id: number;
  SubjectName: string;
}
export interface robust {
  robust_id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
}
