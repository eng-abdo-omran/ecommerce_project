import { useEffect, useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";

export default function LoginPage() {
  const nav = useNavigate();
  const token = useAuthStore((s) => s.token);

  const { mutateAsync, isPending } = useLogin();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password"); // عدّلها حسب عندك

  useEffect(() => {
    if (token) nav("/admin", { replace: true });
  }, [token, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutateAsync({ email, password });
    nav("/admin", { replace: true });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            className="mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        <button
          disabled={isPending}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          {isPending ? "جاري تسجيل الدخول..." : "Login"}
        </button>
      </form>
    </div>
  );
}