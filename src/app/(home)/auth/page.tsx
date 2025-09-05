import { AuthContent } from "@/components/auth-dialog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string }>;
}) {
  const { callbackURL } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(callbackURL ?? "/");
  }

  return (
    <div className="grid flex-1 place-items-center p-4">
      <div className="bg-card mt-16 w-full max-w-[425px] rounded-md border shadow-sm">
        <AuthContent initialType="sign-up" callbackURL={callbackURL} />
      </div>
    </div>
  );
}
