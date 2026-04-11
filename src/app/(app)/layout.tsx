import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f7]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-[220px] flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 p-5">
            <div className="mx-auto w-full max-w-[1200px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

