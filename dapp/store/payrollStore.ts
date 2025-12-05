import { Employee } from "@/types/employee";
import { supabase } from "@/utils/superbase/server";
import { boolean } from "zod";
import { create } from "zustand";

interface PayrollState {
  employees: Employee[];
  addEmployee: (e: {
    first_name: string;
    last_name: string;
    address: string;
    salary: number;
    employer_address: string;
  }) => void;
  addEmployees: (
    list: {
      first_name: string;
      last_name: string;
      address: string;
      salary: number;
    }[],
    employer_address: string
  ) => void;
  removeEmployee: (index: number) => void;
  updateEmployeeTx: (
    index: number,
    depositTx?: string,
    withdrawTx?: string
  ) => void;
  clear: () => void;
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  employees: [],

  addEmployee: async (employee) => {
    const { data, error } = await supabase
      .from("employees")
      .insert({ ...employee, is_active: true });

    if (error) console.error(error);

    set((s) => ({
      employees: [...s.employees, { ...employee, is_active: true }],
    }));
  },

  addEmployees: async (list, employer_address) => {
    const supabaseFormatted = list.map((x) => ({
      first_name: x.first_name,
      last_name: x.last_name,
      address: x.address,
      salary: x.salary,
      employer_address,
      is_active: true,
    }));
    console.log("adding mul emps", supabaseFormatted);
    await supabase.from("employees").insert(supabaseFormatted);

    set((s) => ({
      employees: [
        ...s.employees,
        ...list.map((e) => ({
          ...e,
          salary: Number(e.salary),
          employer_address,
          is_active: true,
        })),
      ],
    }));
  },

  removeEmployee: async (index) => {
    const emp = get().employees[index];

    await supabase.from("employees").delete().eq("address", emp.address);

    set((s) => ({
      employees: s.employees.filter((_, i) => i !== index),
    }));
  },

  updateEmployeeTx: async (index, depositTx, withdrawTx) => {
    const emp = get().employees[index];

    await supabase
      .from("employees")
      .update({ deposit_tx: depositTx, withdraw_tx: withdrawTx })
      .eq("address", emp.address);

    set((s) => ({
      employees: s.employees.map((emp, i) =>
        i === index ? { ...emp, depositTx, withdrawTx } : emp
      ),
    }));
  },

  clear: async () => {
    await supabase.from("employees").delete().neq("id", 0);

    set({ employees: [] });
  },
}));
