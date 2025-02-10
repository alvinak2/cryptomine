// src/components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  HomeIcon,
  BanknotesIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Investments", href: "/dashboard/investments", icon: BanknotesIcon },
  { name: "Statistics", href: "/dashboard/statistics", icon: ChartBarIcon },
  { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

// src/components/dashboard/Sidebar.tsx
// src/components/dashboard/Sidebar.tsx
export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col fixed top-0 bottom-0">
      <div className="flex flex-col h-full bg-crypto-primary border-r border-gray-800">
        <div className="pt-6 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-crypto-bitcoin to-crypto-ethereum flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-crypto-bitcoin via-crypto-ethereum to-crypto-solana bg-clip-text text-transparent">
              Investopia
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto mt-6">
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-crypto-secondary text-crypto-success"
                      : "text-gray-300 hover:bg-crypto-secondary hover:text-crypto-bitcoin"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive
                        ? "text-crypto-success"
                        : "text-gray-400 group-hover:text-crypto-bitcoin"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 border-t border-gray-800 p-4">
            <button
              onClick={async () => {
                try {
                  await signOut({ callbackUrl: "/" });
                } catch (err) {
                  console.error("Error signing out:", err);
                }
              }}
              className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-crypto-secondary hover:text-crypto-bitcoin transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 flex-shrink-0 h-6 w-6" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
