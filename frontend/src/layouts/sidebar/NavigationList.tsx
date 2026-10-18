import { NAVIGATION_SECTIONS } from "../navigation.ts";
import NavigationGroup from "./NavigationGroup.tsx";

const NavigationList = () => (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-6 p-4">
        {NAVIGATION_SECTIONS.map((section) => (
            <NavigationGroup key={section.title} section={section} />
        ))}
    </nav>
);

export default NavigationList;
