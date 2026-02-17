import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/ui/Button";
import { useAuthStore } from "../../../store/auth.store";

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-xl px-3 py-2 text-sm transition ${
          isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
        }`
      }
      end={to === "/account/profile"}
    >
      {label}
    </NavLink>
  );
}

export default function AccountLayout() {
  const nav = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <div className="rounded-3xl border bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-gray-50 p-4">
            <div className="text-sm text-gray-500">مرحباً</div>
            <div className="text-lg font-extrabold text-gray-900 line-clamp-1">
              {user?.name ?? "User"}
            </div>
            <div className="mt-1 text-xs text-gray-500 line-clamp-1">
              {user?.email}
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <Item to="/account/profile" label="الملف الشخصي" />
            <Item to="/account/orders" label="طلباتي" />
            <Item to="/account/addresses" label="العناوين" />
            <Item to="/account/settings" label="الإعدادات" />
          </div>

          <div className="mt-4">
            <Button
              variant="danger"
              className="w-full"
              onClick={() => {
                logout();
                nav("/", { replace: true });
              }}
            >
              تسجيل خروج
            </Button>
          </div>
        </div>
      </aside>

      <main className="lg:col-span-9 min-w-0">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}