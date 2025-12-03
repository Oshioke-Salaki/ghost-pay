"use client";
import React, { useEffect } from "react";
import { usePayrollStore } from "@/store/payrollStore";
import { Copy, Divide, Trash } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { shortenAddress } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { supabase } from "@/utils/superbase/server";

export default function EmployeeTable() {
  const employees = usePayrollStore((s) => s.employees);
  const remove = usePayrollStore((s) => s.removeEmployee);
  const hideAmounts = useUIStore((s) => s.hideAmounts);

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     const { data } = await supabase.from("employees").select("*");
  //     console.log(data);
  //     usePayrollStore.setState({
  //       employees:
  //         data?.map((d) => ({
  //           firstName: d.first_name,
  //           lastName: d.last_name,
  //           address: d.address,
  //           amount: Number(d.amount),
  //           depositTx: d.deposit_tx,
  //           withdrawTx: d.withdraw_tx,
  //         })) || [],
  //     });
  //   };

  //   fetchEmployees();
  // }, []);

  return (
    <div className="mt-4 bg-white p-4 rounded shadow-sm border-[#c5c5c5] border">
      <h3 className="font-semibold text-2xl">Employees</h3>
      {employees.length > 0 ? (
        <table className="w-full mt-2 text-left">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium">First Name</th>
              <th className="px-4 py-3 font-medium">Last Name</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{e.firstName}</td>
                <td className="px-4 py-3">{e.lastName}</td>

                <td className="px-4 py-3 flex items-center gap-2">
                  {shortenAddress(e.address as `0x${string}`)}
                  <CopyButton text={e.address} size={12} />
                </td>

                <td
                  className={`px-4 py-3 ${
                    hideAmounts
                      ? "blur-sm select-none transition-all duration-200"
                      : "transition-all duration-200"
                  }`}
                >
                  {e.amount} STRK
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => remove(i)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <p className="my-8 text-center text-xl font-medium">
            You have no employees added, Create some now.
          </p>
        </div>
      )}
    </div>
  );
}
