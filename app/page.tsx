import {
  SignInButton,
  UserButton,
} from '@clerk/nextjs';

import { auth } from '@clerk/nextjs/server';

export default async function HomePage() {

  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6">

      <div className="max-w-xl text-center space-y-6">

        <h1 className="text-5xl font-bold tracking-tight">
          Payments Platform
        </h1>

        <p className="text-zinc-400 text-lg">
          Sistema de pagos y payouts para plataformas tipo delivery.
        </p>

        {!userId ? (
          <div className="pt-4">
            <SignInButton />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-4">

            <p className="text-green-400 font-medium">
              Sesión iniciada
            </p>

            <UserButton />
          </div>
        )}

      </div>

    </main>
  );
}