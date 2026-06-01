import { TopNav } from '@/components/ui/TopNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}