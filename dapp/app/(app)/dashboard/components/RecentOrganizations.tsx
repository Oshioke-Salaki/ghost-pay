import { Organization } from "@/store/organizationStore";
import { ArrowRight, Building2, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function RecentOrganizations({
  organizations,
}: {
  organizations: Organization[];
}) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Your Organizations</h3>
        <Link
          href="/organizations"
          className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link
          href="/organizations"
          className="group border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer min-h-[180px]"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-colors mb-3">
            <Plus size={24} />
          </div>
          <p className="font-bold text-gray-900">Create New Organization</p>
          <p className="text-xs text-gray-500 mt-1">
            Setup a new payroll entity
          </p>
        </Link>

        {/* Organization List (Top 5) */}
        {organizations.slice(0, 5).map((organization) => (
          <Link
            key={organization.id}
            href={`/organizations/${organization.id}`}
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
                  <Building2 size={20} />
                </div>
                {/* Organization ID removed from display */}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {organization.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-black transition-colors mt-4">
              Manage Dashboard{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default RecentOrganizations;
