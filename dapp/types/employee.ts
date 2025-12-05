export interface Employee {
  address: string;
  salary: number;
  first_name: string;
  last_name: string;
  employer_address: string;
  is_active: boolean;
  secret?: string;
  nullifier?: string;
  pool?: any;
  depositTx?: string;
  withdrawTx?: string;
}
