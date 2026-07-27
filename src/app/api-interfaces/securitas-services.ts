export interface knowWhy {
  cause_id: number;
  service_id: number;
  cause_title: string;
  cause_img: string;
  service_cause_details:
    | {
        cause_desc_id: number;
        cause_id: number;
        cause_desc_title: string;
        cause_desc_details: string;
      }[]
    | [];
}
export interface knowHow {
  process_id: number;
  service_id: number;
  main_title: string;
  process_title: string;
  process_img: string;
  service_process_details: {
    process_desc_id: number;
    process_id: number;
    process_desc_title: string;
    process_desc_details: string;
    multi_desc: boolean;
    service_process_desc_multirows:
      | {
          multirows_id: number;
          process_desc_id: number;
          row_desc: string;
        }[]
      | [];
  }[];
}
export interface checksForIndustry {
  details_id: number;
  ind_id: number;
  title: string;
  img: string;
  icon:string;
  link:string;
  description: string;
  industry_details:
    | {
        details_opt_id: number;
        title: string;
        description: string;
      }[]
    | [];
}
