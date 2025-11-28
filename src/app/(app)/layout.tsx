export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <aside className="flex-1 overflow-y-auto overflow-hidden scroll-smooth">
            {children}
        </aside>
    );
}
