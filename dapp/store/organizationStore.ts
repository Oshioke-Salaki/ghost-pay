import { create } from "zustand";
import { supabase } from "@/utils/superbase/server";

export interface Organization {
  id: string;
  name: string;
  owner_address: string;
  created_at: string;
}

interface OrganizationState {
  organizations: Organization[];
  activeOrganization: Organization | null;
  isLoading: boolean;
  fetchOrganizations: (ownerAddress: string) => Promise<void>;
  createOrganization: (name: string, ownerAddress: string) => Promise<void>;
  setActiveOrganization: (organization: Organization) => void;
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organizations: [],
  activeOrganization: null,
  isLoading: false,

  fetchOrganizations: async (ownerAddress) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("owner_address", ownerAddress.toLowerCase())
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data) {
        set({ organizations: data });
        // Automatically select the first orgainization if none is active
        const currentActive = get().activeOrganization;
        if (!currentActive || !data.find((c) => c.id === currentActive.id)) {
          if (data.length > 0) {
            set({ activeOrganization: data[0] });
          } else {
            set({ activeOrganization: null });
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createOrganization: async (name, ownerAddress) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("organizations")
        .insert([{ name, owner_address: ownerAddress }])
        .select();

      if (error) throw error;

      if (data) {
        set((state) => ({
          organizations: [...state.organizations, data[0]],
          activeOrganization: data[0], // Switch to new organization immediately
        }));
      }
    } catch (err) {
      console.error("Failed to create organization:", err);
      alert("Error creating organization");
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveOrganization: (organization) =>
    set({ activeOrganization: organization }),
}));
