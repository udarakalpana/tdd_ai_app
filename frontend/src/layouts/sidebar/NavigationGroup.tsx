import type { NavigationSection } from "../../types/navigation";
import { useId } from "react";
import NavigationLink from "./NavigationLink.tsx";


/**
 * The list is rendered twice (rail and drawer), so the heading id comes from
 * `useId` to stay unique on the page.
 */
const NavigationGroup = ({ section }: { section: NavigationSection }) => {
    const headingId = useId();

    return (
        <div
            role="group"
            aria-labelledby={headingId}
            className="flex flex-col gap-1"
        >
            <p
                id={headingId}
                className="px-3 pt-1 pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500"
            >
                {section.title}
            </p>
            {section.items.map((item) => (
                <NavigationLink key={item.to} item={item} />
            ))}
        </div>
    );
};

export default NavigationGroup;
