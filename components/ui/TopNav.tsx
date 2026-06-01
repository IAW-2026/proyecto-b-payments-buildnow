'use client';

import { Banknote, LogOut } from 'lucide-react';
import { useClerk } from '@clerk/nextjs'

export function TopNav() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-outline-variant">
      <div className=" mx-auto flex w-full items-center justify-between px-6 py-4">

        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-container">
            <Banknote className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-primary">
              BuildNow Admin
            </h1>

            <p className="text-sm text-on-surface-variant">
              Control financiero
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2 rounded-lg border border-outline-variant
              bg-surface-container-high px-4 py-2 text-sm text-on-surface
              transition-colors hover:bg-surface-container-highest cursor-pointer
            "
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}