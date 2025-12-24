"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@starknet-react/core";
import {
  Building2,
  Users,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/utils/superbase/server";
import { useOrganizationStore } from "@/store/organizationStore";
import WalletConnectButton from "@/components/ConnectWalletButton";
import { motion } from "framer-motion";

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
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch Organizations on Mount or Address Change
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

  // Fetch Stats when organizations list changes
  useEffect(() => {
    const loadStats = async () => {
      if (organizations.length === 0) return;
      setLoadingStats(true);

      try {
        const { data: employees, error } = await supabase
          .from("employees")
          .select("organization_id, salary")
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
                (sum, e) => sum + (Number(e.salary) || 0),
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrganizationName.trim() || !address) return;
    try {
      await createOrganization(newOrganizationName, address);
      setNewOrganizationName("");
      setIsCreating(false);
    } catch (e) {
      alert("Failed to create organization. Check console.");
    }
  };

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

  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
          <Building2 size={32} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">
            Connect your wallet to manage your organizations.
          </p>
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
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

      {/* Creation Modal / Form Area */}
      {isCreating && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mb-8 overflow-hidden"
        >
          <form
            onSubmit={handleCreate}
            className="bg-gray-50 border border-gray-200 p-6 rounded-2xl flex gap-4 items-end"
          >
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Organization Name
              </label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Acme DAO"
                value={newOrganizationName}
                onChange={(e) => setNewOrganizationName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 flex items-center gap-2"
              >
                {isLoading && <Loader2 className="animate-spin" size={16} />}
                Create
              </button>
            </div>
          </form>
        </motion.div>
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
              className="h-[240px] bg-gray-100 rounded-2xl animate-pulse border border-gray-200"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((organization) => {
            const stat = stats[organization.id] || {
              employeeCount: 0,
              totalPayroll: 0,
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
                          {stat.employeeCount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Monthly Payroll</span>
                        <span className="font-mono font-bold">
                          {stat.totalPayroll.toFixed(2)} STRK
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Link
                  href={`/organizations/${organization.id}`}
                  className="mt-auto w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                  onClick={() =>
                    useOrganizationStore
                      .getState()
                      .setActiveOrganization(organization)
                  }
                >
                  Manage <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}

          {/* Empty State */}
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
