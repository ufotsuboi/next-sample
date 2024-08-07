import { signOut } from "@/lib/auth/client";
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <div className="navbar bg-slate-200">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Next Sample</a>
      </div>
      <div className="flex-none">
        {status === "authenticated" && (
          <ul className="menu menu-horizontal px-1">
            <li className="px-4 py-2">{session?.user.email}</li>
            <li>
              <button className="link" onClick={signOut}>
                ログアウト
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto py-4">{children}</div>;
}
