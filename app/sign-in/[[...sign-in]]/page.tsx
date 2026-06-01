import { SignIn } from "@clerk/nextjs";
import { Banknote } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">

      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container">
          <Banknote className="h-8 w-8 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-black">BuildNow Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Ingresá a tu panel de control.</p>
        </div>
      </div>

      <SignIn appearance={{ elements: { headerTitle: 'hidden', headerSubtitle: 'hidden', header: 'hidden' } }} />
    </main>
  );
}