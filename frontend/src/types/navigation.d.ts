export type NavigationItem = {
    label: string;
    to: string;
    /** Inline SVG path data for the item's 24x24 icon. */
    iconPath: string;
};

export type NavigationSection = {
    title: string;
    items: NavigationItem[];
};
