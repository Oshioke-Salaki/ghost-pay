import { Employee } from "./employee";

export interface Payroll {
  employees: Employee[];
  totalAmount: number;
  batchId?: string;
  status?: "pending" | "processing" | "completed" | "failed";
}
