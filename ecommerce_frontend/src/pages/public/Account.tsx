import { useAuthStore } from "../../store/auth.store";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-2">
      <h1 className="text-2xl font-extrabold">حسابي</h1>
      <p className="text-gray-600">مرحباً {user?.name ?? "User"}</p>
      <p className="text-sm text-gray-500">{user?.email}</p>
      <p className="text-xs text-gray-500">هنا لاحقًا: الطلبات، العناوين، الإعدادات…</p>
    </div>
  );
}