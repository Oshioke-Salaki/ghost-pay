import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { SetStateAction, useState } from "react";

function NewOrganizationForm({
  setIsCreating,
  address,
  createOrganization,
  isLoading,
}: {
  setIsCreating: (value: SetStateAction<boolean>) => void;
  address: `0x${string}`;
  createOrganization: (name: string, ownerAddress: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [newOrganizationName, setNewOrganizationName] = useState("");
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
  return (
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
  );
}

export default NewOrganizationForm;
