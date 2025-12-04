"use client";
import React, { useEffect } from "react";
import { usePayrollStore } from "@/store/payrollStore";
import { Copy, Divide, Loader2, Pause, Trash } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { shortenAddress } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { supabase } from "@/utils/superbase/server";
import { useAccount } from "@starknet-react/core";

export default function EmployeeTable() {
  const { address: employer } = useAccount();
  const [loading, setLoading] = React.useState(true);
  const employees = usePayrollStore((s) => s.employees);
  const remove = usePayrollStore((s) => s.removeEmployee);
  const hideAmounts = useUIStore((s) => s.hideAmounts);

  useEffect(() => {
    if (!employer) return;
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("employees")
          .select("*")
          .eq("employer_address", employer);
        console.log(data);
        usePayrollStore.setState({
          employees:
            data?.map((d) => ({
              first_name: d.first_name,
              last_name: d.last_name,
              address: d.address,
              salary: Number(d.salary),
              employer_address: d.employer_address,
              is_active: true,
            })) || [],
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employer]);

  if (!employer) {
    return (
      <div className="mt-4 p-4 bg-white rounded shadow-sm border">
        <p className="text-center text-lg py-10">
          Connect your wallet to view your employees.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 py-10 bg-white rounded shadow-sm border flex justify-center">
        <Loader2
          size={50}
          className="animate-spin text-[#c4c4c4]"
          strokeWidth={2}
        />
      </div>
    );
  }

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
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{e.first_name}</td>
                <td className="px-4 py-3">{e.last_name}</td>

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
                  {e.salary} STRK
                </td>
                <td className={`px-4 py-3`}>
                  {e.is_active ? (
                    <span className="text-green-400 font-medium">Active</span>
                  ) : (
                    <span>Inactive</span>
                  )}
                </td>

                <td className="px-4 py-3 flex gap-x-2">
                  <button
                    onClick={() => remove(i)}
                    className="text-red-600 hover:text-red-800 border-[#c5c5c5] border p-2 rounded"
                  >
                    <Trash size={16} />
                  </button>
                  {/* <button
                    onClick={() => remove(i)}
                    className="text-orange-600 hover:text-orange-800 border-[#c5c5c5] border p-2 rounded"
                  >
                    <Pause size={16} />
                  </button> */}
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
