"use client";

export function Navbar() {
  return (
    <header className="card mx-auto mt-5 w-full max-w-[1200px] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[38px] leading-none text-[#152539]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Resume Dashboard
          </div>
          <div className="mt-1 text-xs text-[#6c7a89]">Filter and analyze submitted resumes</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-8 px-3 text-xs">Export</button>
          <button className="btn-primary h-8 px-3 text-xs">Upload</button>
        </div>
      </div>
    </header>
  );
}

