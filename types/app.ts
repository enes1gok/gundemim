export type AgeRange = '13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
export type Gender = 'erkek' | 'kadin' | 'belirtmek_istemiyorum';
export type Education =
  | 'ilkokul'
  | 'ortaokul'
  | 'lise'
  | 'onlisans'
  | 'lisans'
  | 'yukseklisans'
  | 'doktora';
export type Category = 'siyaset' | 'ekonomi' | 'spor' | 'kultur';
export type SurveyStatus = 'draft' | 'scheduled' | 'active' | 'completed';

export interface SurveyOption {
  id: string;
  text: string;
  order: number;
}

export interface Survey {
  id: string;
  question: string;
  description: string | null;
  options: SurveyOption[];
  category: Category;
  status: SurveyStatus;
  scheduled_for: string;
  total_votes: number;
  created_at: string;
  published_at: string | null;
}

export interface Vote {
  id: string;
  survey_id: string;
  device_id: string;
  option_id: string;
  voted_at: string;
}

export interface UserProfile {
  device_id: string;
  age_range: AgeRange | null;
  gender: Gender | null;
  region: string | null;
  education: Education | null;
  interests: Category[];
  onboarding_completed: boolean;
  created_at: string;
}

export interface OptionResult {
  option_id: string;
  option_text: string;
  vote_count: number;
  percentage: number;
}

export interface DemographicBreakdown {
  label: string;
  options: Record<string, number>;
}

export interface SurveyResults {
  survey_id: string;
  total_votes: number;
  options: OptionResult[];
  by_age: Record<string, Record<string, number>>;
  by_gender: Record<string, Record<string, number>>;
  by_region: Record<string, Record<string, number>>;
  by_education: Record<string, Record<string, number>>;
}
