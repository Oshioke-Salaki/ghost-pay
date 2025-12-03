import { useUIStore } from "@/store/uiStore";

function ToggleAmountsDisplay() {
  const hideAmounts = useUIStore((s) => s.hideAmounts);
  const toggle = useUIStore((s) => s.toggleHideAmounts);
  return (
    <button
      onClick={toggle}
      className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
    >
      {hideAmounts ? "Show Amounts" : "Hide Amounts"}
    </button>
  );
}

export default ToggleAmountsDisplay;
