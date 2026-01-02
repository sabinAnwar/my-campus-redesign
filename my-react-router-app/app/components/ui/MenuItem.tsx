import { Link } from "react-router-dom";
import type { MenuItemProps } from "~/types/navigation";

/**
 * Menu item component for navigation menus and dropdowns.
 * Supports danger styling for destructive actions like logout.
 */
export function MenuItem({ to, icon: Icon, label, danger }: MenuItemProps) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-4 border-transparent ${
        danger
          ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-500 font-bold"
          : "hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 text-muted-foreground font-medium"
      }`}
    >
      <Icon
        className={`h-4 w-4 transition-colors ${
          danger
            ? "text-rose-500 group-hover:text-rose-600"
            : "text-muted-foreground group-hover:text-neutral-900"
        }`}
      />
      <span className="font-bold">{label}</span>
    </Link>
  );
}

export default MenuItem;
