"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 left-0 hidden h-screen w-fit flex-col justify-between bg-dark-1 pt-28 p-6 lg:flex min-w-[264px]">
        <div className="flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const active = pathname === link.route || (link.route !== "/" && pathname.startsWith(link.route));
            return (
              <Link
                key={link.route}
                href={link.route}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-4 py-3 text-base font-semibold transition-colors",
                  active ? "bg-blue-1 text-white" : "text-gray-400 hover:bg-dark-3 hover:text-white"
                )}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <section className="fixed bottom-0 left-0 right-0 z-50 flex w-full bg-dark-1 px-4 py-3 lg:hidden">
        {sidebarLinks.map((link) => {
          const active = pathname === link.route || (link.route !== "/" && pathname.startsWith(link.route));
          return (
            <Link
              key={link.route}
              href={link.route}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 text-xs",
                active ? "text-blue-1" : "text-gray-400"
              )}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="hidden sm:block">{link.label}</span>
            </Link>
          );
        })}
      </section>
    </>
  );
}
