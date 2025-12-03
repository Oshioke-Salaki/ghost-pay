// import { Employee } from "@/types/employee";
// import { create } from "zustand";

// interface PayrollState {
//   employees: Employee[];
//   addEmployee: (e: {
//     firstName: string;
//     lastName: string;
//     address: string;
//     amount: number;
//   }) => void;
//   addEmployees: (
//     list: {
//       firstName: string;
//       lastName: string;
//       address: string;
//       amount: number;
//     }[]
//   ) => void;
//   removeEmployee: (index: number) => void;
//   updateEmployeeTx: (
//     index: number,
//     depositTx?: string,
//     withdrawTx?: string
//   ) => void;
//   clear: () => void;
// }

// export const usePayrollStore = create<PayrollState>((set, get) => ({
//   employees: [],

//   addEmployee: async (e) => {
//     const { data, error } = await supabase.from("employees").insert({
//       first_name: e.firstName,
//       last_name: e.lastName,
//       address: e.address,
//       amount: e.amount,
//     });

//     if (error) console.error(error);

//     set((s) => ({
//       employees: [...s.employees, e],
//     }));
//   },

//   addEmployees: async (list) => {
//     const supabaseFormatted = list.map((x) => ({
//       first_name: x.firstName,
//       last_name: x.lastName,
//       address: x.address,
//       amount: x.amount,
//     }));

//     await supabase.from("employees").insert(supabaseFormatted);

//     set((s) => ({
//       employees: [
//         ...s.employees,
//         ...list.map((e) => ({ ...e, amount: Number(e.amount) })),
//       ],
//     }));
//   },

//   removeEmployee: async (index) => {
//     const emp = get().employees[index];

//     await supabase.from("employees").delete().eq("address", emp.address);

//     set((s) => ({
//       employees: s.employees.filter((_, i) => i !== index),
//     }));
//   },

//   updateEmployeeTx: async (index, depositTx, withdrawTx) => {
//     const emp = get().employees[index];

//     await supabase
//       .from("employees")
//       .update({ deposit_tx: depositTx, withdraw_tx: withdrawTx })
//       .eq("address", emp.address);

//     set((s) => ({
//       employees: s.employees.map((emp, i) =>
//         i === index ? { ...emp, depositTx, withdrawTx } : emp
//       ),
//     }));
//   },

//   clear: async () => {
//     await supabase.from("employees").delete().neq("id", 0);

//     set({ employees: [] });
//   },
// }));

import { Employee } from "@/types/employee";
import { create } from "zustand";

interface PayrollState {
  employees: Employee[];
  addEmployee: (e: {
    firstName: string;
    lastName: string;
    address: string;
    amount: number;
  }) => void;
  addEmployees: (
    list: {
      firstName: string;
      lastName: string;
      address: string;
      amount: number;
    }[]
  ) => void;
  removeEmployee: (index: number) => void;
  updateEmployeeTx: (
    index: number,
    depositTx?: string,
    withdrawTx?: string
  ) => void;
  clear: () => void;
}

export const usePayrollStore = create<PayrollState>((set) => ({
  employees: [],
  addEmployee: (e) =>
    set((s) => ({
      employees: [
        ...s.employees,
        {
          firstName: e.firstName,
          lastName: e.lastName,
          address: e.address,
          amount: e.amount,
        },
      ],
    })),
  addEmployees: (list) =>
    set((s) => ({
      employees: [
        ...s.employees,
        ...list.map((x) => ({
          firstName: x.firstName,
          lastName: x.lastName,
          address: x.address,
          amount: Number(x.amount),
        })),
      ],
    })),
  removeEmployee: (index) =>
    set((s) => ({ employees: s.employees.filter((_, i) => i !== index) })),
  updateEmployeeTx: (index, depositTx, withdrawTx) =>
    set((s) => ({
      employees: s.employees.map((emp, i) =>
        i === index ? { ...emp, depositTx, withdrawTx } : emp
      ),
    })),
  clear: () => set({ employees: [] }),
}));
