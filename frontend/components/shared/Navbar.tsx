"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-1">Zoom</span>
        <span className="text-2xl font-bold text-white">Clone</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Default User</span>
        <div className="h-8 w-8 rounded-full bg-dark-4 flex-center text-white text-xs font-bold">
          DU
        </div>
      </div>
    </nav>
  );
}
