import { Organization, useOrganizationStore } from "@/store/organizationStore";
import { supabase } from "@/utils/superbase/server";
import { ArrowRight, Building2, Edit2, Trash2, Users } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

function OrganizationCard({
  organization,
  address,
  fetchOrganizations,
  stat,
  loadingStats,
}: {
  organization: Organization;
  address: `0x${string}`;
  fetchOrganizations: (ownerAddress: string) => Promise<void>;
  stat: {
    employeeCount: Number;
    totalPayroll: Number;
  };
  loadingStats: boolean;
}) {
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure? This will delete the organization and all employee records."
      )
    )
      return;

    try {
      const { error: empError } = await supabase
        .from("employees")
        .delete()
        .eq("organization_id", id);
      if (empError) throw empError;

      const { error: orgError } = await supabase
        .from("organizations")
        .delete()
        .eq("id", id);
      if (orgError) throw orgError;

      if (address) await fetchOrganizations(address);
    } catch (e) {
      console.error(e);
      alert("Failed to delete organization");
    }
  };
  return (
    <div
      key={organization.id}
      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all flex flex-col relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
          <Building2 size={24} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black">
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(organization.id)}
            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold capitalize text-gray-900 mb-1 truncate">
        {organization.name}
      </h3>

      <div className="space-y-3 mb-8 min-h-[50px]">
        {loadingStats ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-2">
                <Users size={14} /> Employees
              </span>
              <span className="font-medium">
                {stat.employeeCount as ReactNode}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monthly Payroll</span>
              <span className="font-mono font-bold">
                ${stat.totalPayroll.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      <Link
        href={`/organizations/${organization.id}`}
        className="mt-auto w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
        onClick={() =>
          useOrganizationStore.getState().setActiveOrganization(organization)
        }
      >
        Manage <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default OrganizationCard;
