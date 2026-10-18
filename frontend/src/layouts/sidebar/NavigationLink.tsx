import type { NavigationItem } from "../../types/navigation";
import { NavLink } from "react-router";
import { cn } from "../../utils/cn.ts";

const linkClasses = ({ isActive }: { isActive: boolean }): string =>
    cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500",
        isActive
            ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
    );

const NavigationLink = ({ item }: { item: NavigationItem }) => (
    <NavLink to={item.to} className={linkClasses} end>
        {({ isActive }) => (
            <>
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={cn(
                        "size-5 shrink-0 transition",
                        isActive
                            ? "text-brand-600 dark:text-brand-400"
                            : "text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300",
                    )}
                    aria-hidden="true"
                >
                    <path d={item.iconPath} />
                </svg>
                {item.label}
            </>
        )}
    </NavLink>
);
export default NavigationLink;
