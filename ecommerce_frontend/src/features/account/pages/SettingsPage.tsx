import { Button } from "../../../shared/components/ui/Button";
import { useAuthStore } from "../../../store/auth.store";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const nav = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">الإعدادات</h1>
        <p className="text-sm text-gray-500">تسجيل خروج وإعدادات عامة.</p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-red-700">تسجيل الخروج</div>
            <div className="text-sm text-gray-600">سيتم تسجيل خروجك من الحساب.</div>
          </div>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              nav("/", { replace: true });
            }}
          >
            خروج
          </Button>
        </div>
      </div>
    </div>
  );
}