import { Employee } from "@/types/employee";
import { supabase } from "@/utils/superbase/server";
import { create } from "zustand";

interface PayrollState {
  employees: Employee[];
  addEmployee: (e: {
    first_name: string;
    last_name: string;
    address: string;
    salary_usd: number;
    employer_address: string;
    organization_id: string;
    position?: string;
  }) => void;
  addEmployees: (
    employees: {
      first_name: string;
      last_name: string;
      address: string;
      salary_usd: number;
    }[],
    organizationId: string,
    employerAddress: string
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

    if (error) console.error(error);

    set((s) => ({
      employees: [...s.employees, { ...employee, is_active: true }],
    }));
  },

  addEmployees: async (employees, organizationId, employerAddress) => {
    const employeesWithMeta = employees.map((e) => ({
      ...e,
      organization_id: organizationId,
      employer_address: employerAddress,
      is_active: true,
    }));

    const { error } = await supabase.from("employees").insert(employeesWithMeta);

    if (error) {
      console.error("Bulk add error:", error);
      return;
    }

    set((s) => ({
      employees: [...s.employees, ...employeesWithMeta],
    }));
  },

  removeEmployee: async (index) => {
    const emp = get().employees[index];
    // Delete by address AND employer/org to be safe
    await supabase.from("employees").delete().eq("address", emp.address).eq("organization_id", emp.organization_id);

    set((s) => ({
      employees: s.employees.filter((_, i) => i !== index),
    }));
  },

  clear: async () => {
    set({ employees: [] });
  },
}));
