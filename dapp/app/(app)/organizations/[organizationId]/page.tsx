"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "@starknet-react/core";
import {
  Building2,
  Users,
  ArrowLeft,
  History,
  Settings,
  ShieldAlert,
  Edit2,
  Trash2,
  X,
  Loader2,
  Wallet,
  Coins,
  CalendarClock
} from "lucide-react";
import { useOrganizationStore } from "@/store/organizationStore";
import WalletConnectButton from "@/components/ConnectWalletButton";
import SwapModal from "@/components/SwapModal";
import EmployeeTable from "../../employees/components/EmployeeTable";
import { supabase } from "@/utils/superbase/server";

export default function OrganizationDashboardPage() {
  const { organizationId } = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const {
    organizations,
    activeOrganization,
    setActiveOrganization,
    fetchOrganizations,
    isLoading,
  } = useOrganizationStore();

  const [showSwap, setShowSwap] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Stats State
  const [stats, setStats] = useState({
    employeeCount: 0,
    totalPayroll: 0,
    loading: true
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync active organization from URL
  useEffect(() => {
    if (address && organizationId) {
      const sync = async () => {
        if (organizations.length === 0) {
          await fetchOrganizations(address);
        }

        const targetId = Array.isArray(organizationId)
          ? organizationId[0]
          : organizationId;
        const targetOrganization = useOrganizationStore
          .getState()
          .organizations.find((c) => c.id === targetId);

        if (targetOrganization) {
          setActiveOrganization(targetOrganization);
          setEditName(targetOrganization.name);
          
          // Fetch Stats
          fetchStats(targetId);
        }
        setIsSyncing(false);
      };
      sync();
    }
  }, [organizationId, address]); 

  const fetchStats = async (orgId: string) => {
      try {
          const { data, error } = await supabase
            .from("employees")
            .select("salary_usd")
            .eq("organization_id", orgId)
            .eq("is_active", true);

          if (error) throw error;

          if (data) {
              const total = data.reduce((acc, curr) => acc + (curr.salary_usd || 0), 0);
              setStats({
                  employeeCount: data.length,
                  totalPayroll: total,
                  loading: false
              });
          } else {
             // No data found or empty
             setStats(prev => ({ ...prev, loading: false }));
          }
      } catch (e) {
          console.error("Error fetching stats", e);
          setStats(p => ({ ...p, loading: false }));
      }
  };

  const handleDelete = async () => {
    if (
      !activeOrganization ||
      !confirm(
        "Are you sure you want to delete this organization? This action cannot be undone and will remove all employee records associated with it."
      )
    )
      return;

    try {
      // Delete employees first due to foreign key constraints
      await supabase
        .from("employees")
        .delete()
        .eq("organization_id", activeOrganization.id);
      // Delete organization
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", activeOrganization.id);

      if (error) throw error;

      // Refresh store and redirect
      if (address) await fetchOrganizations(address);
      router.push("/organizations");
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete organization.");
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrganization || !editName.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("organizations")
        .update({ name: editName })
        .eq("id", activeOrganization.id);

      if (error) throw error;

      // Update local state
      setActiveOrganization({ ...activeOrganization, name: editName });
      // Refresh global list
      if (address) fetchOrganizations(address);

      setIsEditing(false);
      setIsSettingsOpen(false);
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update name.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-sm">
          <Building2 size={32} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">
            Connect your wallet to access this organization.
          </p>
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (isSyncing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading Organization details...
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Organization Not Found
        </h2>
        <p className="text-gray-500 mt-2 mb-8">
          You do not have access to this organization or it does not exist.
        </p>
        <Link
          href="/organizations"
          className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          Back to All Organizations
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-[120px] max-w-7xl mx-auto relative">
      <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />

      {/* --- EDIT MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Rename Organization</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateName}>
              <input
                autoFocus
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-black transition-colors"
                placeholder="Enter new name"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !editName.trim()}
                  className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader2 className="animate-spin" size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="mb-10">
        <Link
          href="/organizations"
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-6 transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Organizations
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-linear-to-br from-gray-900 to-black text-white rounded-3xl flex items-center justify-center shadow-lg">
              <Building2 size={40} />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <h1 className="text-4xl capitalize font-bold text-gray-900 tracking-tight">
                {activeOrganization.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                Active
              </span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <Link
              href={`/organizations/${activeOrganization.id}/history`}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 transition-all shadow-sm"
            >
              <History size={18} /> History
            </Link>

            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2.5 border rounded-xl transition-all ${
                  isSettingsOpen
                    ? "bg-gray-100 border-gray-300 text-black"
                    : "border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings size={20} />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={() => {
                      setEditName(activeOrganization.name);
                      setIsEditing(true);
                      setIsSettingsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Edit2 size={16} /> Edit Name
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 transition-colors"
                  >
                    <Trash2 size={16} /> Delete Organization
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW OVERVIEW STATS --- */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Employee Count Card */}
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Users size={24} />
                  </div>
                  <div>
                      <p className="text-sm text-gray-500 font-medium">Total Employees</p>
                      <h4 className="text-3xl font-bold text-gray-900">
                          {stats.loading ? <span className="animate-pulse bg-gray-200 rounded text-transparent">00</span> : stats.employeeCount}
                      </h4>
                  </div>
             </div>
             
             {/* Payroll Estimate Card */}
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <Coins size={24} />
                  </div>
                  <div>
                      <p className="text-sm text-gray-500 font-medium">Monthly Payroll</p>
                      <h4 className="text-3xl font-bold text-gray-900 flex items-baseline gap-1">
                          {stats.loading ? <span className="animate-pulse bg-gray-200 rounded text-transparent">0000</span> : `$${stats.totalPayroll.toLocaleString()}`}
                          <span className="text-sm font-normal text-gray-400">USD</span>
                      </h4>
                  </div>
             </div>
        </div>
      </div>

      {/* --- ROSTER --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Employee Roster</h3>
        </div>
        <EmployeeTable />
      </div>
    </div>
  );
}
