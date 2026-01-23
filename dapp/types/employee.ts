export interface Employee {
  id?: number;
  first_name: string;
  last_name: string;
  address: string;
  salary_usd: number;
  employer_address: string;
  is_active: boolean;
  position?: string;
  organization_id?: string;
}
