import { Employee } from "@/types/employee";
import { supabase } from "@/utils/superbase/server";
import { create } from "zustand";

interface PayrollState {
  employees: Employee[];
  addEmployee: (e: {
    first_name: string;
    last_name: string;
    address: string;
    salary: number;
    employer_address: string;
    organization_id: string;
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
  clear: () => void;
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  employees: [],

  addEmployee: async (employee) => {
    const { data, error, status } = await supabase
      .from("employees")
      .insert({ ...employee, is_active: true });

    console.log(data, status, "employee add data");

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
    const { data, error, status } = await supabase
      .from("employees")
      .insert(supabaseFormatted);

    if (error) console.error(error);

    set((s) => ({
      employees: [...s.employees, ...supabaseFormatted],
    }));
  },

  removeEmployee: async (index) => {
    const emp = get().employees[index];

    await supabase.from("employees").delete().eq("address", emp.address);

    set((s) => ({
      employees: s.employees.filter((_, i) => i !== index),
    }));
  },

  clear: async () => {
    await supabase.from("employees").delete().neq("id", 0);

    set({ employees: [] });
  },
}));
