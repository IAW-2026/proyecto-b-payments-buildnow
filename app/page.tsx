import {
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import { auth } from "@clerk/nextjs/server";

import MercadoPagoButton
  from "@/components/MercadoPagoButton";

export default async function HomePage() {

  const { userId } = await auth();

  return (
    <main className="
      min-h-screen
      bg-zinc-950
      text-white
      flex
      flex-col
      items-center
      justify-center
      px-6
    ">

      <div className="
        max-w-xl
        text-center
        space-y-6
      ">

        <h1 className="text-5xl font-bold">
          Payments Platform
        </h1>

        {!userId ? (

          <SignInButton />

        ) : (

          <div className="
            flex
            flex-col
            items-center
            gap-6
          ">

            <UserButton />

            <p className="text-green-400">
              Sesión iniciada
            </p>

            <MercadoPagoButton />

          </div>

        )}

      </div>

    </main>
  );
}