import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";

export default function AuthPage() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();

  const modeParam = sp.get("mode");
  const returnTo = sp.get("returnTo") || "/";
  const initialMode = modeParam === "register" ? "register" : "login";

  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);

  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [password2, setPassword2] = useState("password");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const loginMut = useLogin();
  const registerMut = useRegister();

  // لو already logged in: redirect حسب role
  useEffect(() => {
    if (!token) return;
    if (role === 1) nav("/admin", { replace: true });
    else nav(returnTo || "/account", { replace: true });
  }, [token, role, nav, returnTo]);

  function setModeAndUrl(next: "login" | "register") {
    setMode(next);
    const n = new URLSearchParams(sp);
    n.set("mode", next);
    setSp(n, { replace: true });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "login") {
      const res = await loginMut.mutateAsync({ email, password });
      if (res.role === 1) nav("/admin", { replace: true });
      else nav(returnTo || "/account", { replace: true });
      return;
    }

    // register
    if (password.length < 8) {
      alert("كلمة المرور يجب ألا تقل عن 8 أحرف");
      return;
    }
    if (password !== password2) {
      alert("تأكيد كلمة المرور غير مطابق");
      return;
    }

    const res = await registerMut.mutateAsync({
      name,
      email,
      password,
      password_confirmation: password2,
      phone: phone || null,
      address: address || null,
    });

    // useRegister بيرجع login response
    if (res.role === 1) nav("/admin", { replace: true });
    else nav(returnTo || "/account", { replace: true });
  }

  const isPending = loginMut.isPending || registerMut.isPending;

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-4 border">
        <div className="flex items-center gap-2">
          <button
            className={`flex-1 h-10 rounded-xl border ${
              mode === "login" ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => setModeAndUrl("login")}
            type="button"
          >
            تسجيل الدخول
          </button>
          <button
            className={`flex-1 h-10 rounded-xl border ${
              mode === "register" ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => setModeAndUrl("register")}
            type="button"
          >
            إنشاء حساب
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "register" ? (
            <>
              <div>
                <label className="text-sm text-gray-600">الاسم</label>
                <input
                  className="mt-1 w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-600">الهاتف (اختياري)</label>
                  <input
                    className="mt-1 w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">العنوان (اختياري)</label>
                  <input
                    className="mt-1 w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : null}

          <div>
            <label className="text-sm text-gray-600">البريد الإلكتروني</label>
            <input
              className="mt-1 w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">كلمة المرور</label>
            <input
              className="mt-1 w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {mode === "register" ? (
            <div>
              <label className="text-sm text-gray-600">تأكيد كلمة المرور</label>
              <input
                className="mt-1 w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                type="password"
                required
              />
            </div>
          ) : null}

          <button
            disabled={isPending}
            className="w-full h-11 rounded-xl bg-black text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {isPending ? "جاري..." : mode === "login" ? "دخول" : "إنشاء حساب"}
          </button>
        </form>

        <p className="text-xs text-gray-500">
          سيتم إرجاعك بعد الدخول إلى:{" "}
          <span className="font-medium text-gray-700">{returnTo}</span>
        </p>
      </div>
    </div>
  );
}