export interface Employee {
  address: string;
  amount: number;
  firstName: string;
  lastName: string;
  secret?: string;
  nullifier?: string;
  pool?: any;
  depositTx?: string;
  withdrawTx?: string;
}
