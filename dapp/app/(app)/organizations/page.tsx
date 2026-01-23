"use client";
import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/utils/superbase/server";
import { useOrganizationStore } from "@/store/organizationStore";

import WalletRequired from "@/components/WalletRequired";
import NewOrganizationForm from "./components/NewOrganizationForm";
import OrganizationCard from "./components/OrganizationCard";

interface OrganizationStats {
  id: string;
  employeeCount: number;
  totalPayroll: number;
}

export default function OrganizationsPage() {
  const { address } = useAccount();
  const { organizations, fetchOrganizations, createOrganization, isLoading } =
    useOrganizationStore();

  const [stats, setStats] = useState<Record<string, OrganizationStats>>({});
  const [isCreating, setIsCreating] = useState(false);

  const [loadingStats, setLoadingStats] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (address) {
        setFetchError(null);
        try {
          await fetchOrganizations(address);
        } catch (e: any) {
          console.error("Failed to fetch organizations:", e);
          setFetchError("Unable to load organizations. Please try again.");
        }
      }
    };
    init();
  }, [address, fetchOrganizations]);

  useEffect(() => {
    const loadStats = async () => {
      if (organizations.length === 0) return;
      setLoadingStats(true);

      try {
        const { data: employees, error } = await supabase
          .from("employees")
          .select("organization_id, salary_usd")
          .in(
            "organization_id",
            organizations.map((c) => c.id)
          );

        if (error) throw error;

        const newStats: Record<string, OrganizationStats> = {};
        if (employees) {
          organizations.forEach((organization) => {
            const organizationEmployees = employees.filter(
              (e) => e.organization_id === organization.id
            );
            newStats[organization.id] = {
              id: organization.id,
              employeeCount: organizationEmployees.length,
              totalPayroll: organizationEmployees.reduce(
                (sum, e) => sum + (Number(e.salary_usd) || 0),
                0
              ),
            };
          });
        }
        setStats(newStats);
      } catch (e) {
        console.error("Stats load error:", e);
        // We don't fail the whole page for stats, just log
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [organizations]);

  if (!address) {
    return (
      <WalletRequired description="Connect your wallet to manage your organizations." />
    );
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Your Organizations
          </h1>
          <p className="text-gray-500 mt-1">
            Manage multiple entities, DAOs, or projects.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isLoading || !!fetchError}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} /> New Organization
        </button>
      </div>

      {isCreating && (
        <NewOrganizationForm
          setIsCreating={setIsCreating}
          address={address}
          createOrganization={createOrganization}
          isLoading={isLoading}
        />
      )}

      {/* Error State */}
      {fetchError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between text-red-600">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{fetchError}</span>
          </div>
          <button
            onClick={() => address && fetchOrganizations(address)}
            className="flex items-center gap-1 text-sm font-bold hover:underline"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {isLoading && organizations.length === 0 ? (
        // --- LOADING SKELETON ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-60 bg-gray-100 rounded-2xl animate-pulse border border-gray-200"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((organization, i) => {
            const stat = stats[organization.id] || {
              employeeCount: 0,
              totalPayroll: 0,
            };
            return (
              <OrganizationCard
                key={i}
                organization={organization}
                address={address}
                fetchOrganizations={fetchOrganizations}
                stat={stat}
                loadingStats={loadingStats}
              />
            );
          })}

          {organizations.length === 0 &&
            !isLoading &&
            !isCreating &&
            !fetchError && (
              <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p>No organizations found.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
