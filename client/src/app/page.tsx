import { redirect } from "next/navigation";

// Root route has no standalone content — send everyone to the login gate.
// AuthGuard inside (dealer)/(admin) layouts handles onward routing by role.
export default function RootPage() {
  redirect("/login");
}
