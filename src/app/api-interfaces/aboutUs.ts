export interface about {
  id: number;
  title: string;
  desc1: string;
  desc2: string;
  img: string;
  options: {
    opt_id: number;
    about_id: number;
    details: string;
  }[];
  achievements: achievements[];
}
export interface achievements {
  achieved_id: number;
  about_id: number;
  title: string;
  count: string;
  img: string;
  unit: string;
  initial_count: string;
}
export interface faq {
  faq_id: number;
  title: string;
  slug?: string;
  link: string;
  icon: string;
  faq_details: {
    faq_details_id: number;
    title: string;
    desc: string;
  }[];
}
export interface teams {
  id: number;
  name: string;
  designation: string;
  img: string;
  social_icons: {
    social_id: number;
    team_id: number;
    icon_name: string;
    link: string;
    icon: string;
  }[];
}
export interface partnerusData {
  id: number;
  title: string;
  desc: string;
  img: string;
  causes: {
    cause_partner_id: number;
    partner_content_id: number;
    title: string;
    desc: string;
    img: string;
    options: {
      cause_opt_id: number;
      cause_id: number;
      title: string;
      desc: string;
      icon: string;
    }[];
  };
}
