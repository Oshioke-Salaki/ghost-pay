"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { usePayrollStore } from "@/store/payrollStore";
import { Trash, Loader2, User } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { shortenAddress } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { supabase } from "@/utils/superbase/server";
import { useAccount } from "@starknet-react/core";
import { useOrganizationStore } from "@/store/organizationStore";
import toast from "react-hot-toast";

export default function EmployeeTable() {
  const { address: employer } = useAccount();
  const [loading, setLoading] = React.useState(true);
  const [deletingIndex, setDeletingIndex] = React.useState<number | null>(null);
  const employees = usePayrollStore((s) => s.employees);
  const remove = usePayrollStore((s) => s.removeEmployee);
  const hideAmounts = useUIStore((s) => s.hideAmounts);
  const { activeOrganization } = useOrganizationStore();
  const router = useRouter();

  const params = useParams();

  const organizationId = params.organizationId
    ? Array.isArray(params.organizationId)
      ? params.organizationId[0]
      : params.organizationId
    : activeOrganization?.id;

  const handleDelete = async (index: number) => {
    if (deletingIndex !== null) return;
    setDeletingIndex(index);
    try {
      await remove(index);
      toast.success("Employee removed");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete employee");
    } finally {
      setDeletingIndex(null);
    }
  };

  useEffect(() => {
    if (!employer || !organizationId) return;

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("employer_address", employer)
          .eq("organization_id", organizationId);
        if (error) throw error;

        usePayrollStore.setState({
          employees:
            data?.map((d) => ({
              first_name: d.first_name,
              last_name: d.last_name,
              address: d.address,
              salary_usd: Number(d.salary_usd), // Now using salary_usd
              position: d.position,
              employer_address: d.employer_address,
              organization_id: d.organization_id,
              is_active: true,
            })) || [],
        });
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employer, organizationId]);

  if (loading) {
    return (
      <div className="mt-4 h-64 bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">
          Syncing roster...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Employee Roster</h3>
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {employees.length} entries
          </span>
        </div>

        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Wallet Address</th>
                  <th className="px-6 py-4">Monthly Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {employees.map((e, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User size={14} />
                        </div>
                        {e.first_name} {e.last_name}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {e.position ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {e.position}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono text-gray-600 bg-gray-50 w-fit px-2 py-1 rounded border border-gray-200">
                        {shortenAddress(e.address as `0x${string}`)}
                        <CopyButton text={e.address} size={14} />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`font-mono font-medium ${
                          hideAmounts ? "blur-sm select-none" : ""
                        }`}
                      >
                        $
                        {(e.salary_usd || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <span className="text-gray-400 text-xs ml-1">USD</span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {e.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(i)}
                        disabled={deletingIndex !== null}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove Employee"
                      >
                        {deletingIndex === i ? (
                          <Loader2
                            size={16}
                            className="animate-spin text-red-500"
                          />
                        ) : (
                          <Trash size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-gray-400" size={20} />
            </div>
            <h4 className="text-gray-900 font-medium">No employees found</h4>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
              Get started by adding employees to your roster via the "Manage
              Employees" page.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        {organizationId && (
          <button
            disabled={loading}
            onClick={() => {
              router.push(`/employees?org=${organizationId}`);
            }}
            className="px-6 py-3 rounded-lg border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Manage Employees
          </button>
        )}

        {employees.length > 0 && organizationId && (
          <Link
            href={`/organizations/${organizationId}/distribute`}
            className="px-6 py-3 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Review & Distribute
          </Link>
        )}
      </div>
    </div>
  );
}
