/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { Loader } from "../../../shared/components/ui/Loader";
import { useAuthStore } from "../../../store/auth.store";
import { useMe } from "../hooks/useMe";
import { updateMe } from "../api/account.api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const role = useAuthStore((s) => s.role);

  const meQ = useMe(Boolean(token));

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u = meQ.data?.data;
    if (u) {
      setName(u.name ?? "");
      setPhone(u.phone ?? "");
      setAddress(u.address ?? "");
    }
  }, [meQ.data]);

  async function onSave() {
    try {
      setSaving(true);
      const res = await updateMe({ name, phone: phone || null, address: address || null });
      toast.success(res.message || "تم التحديث ✅");

      // حدّث auth.store user عشان UI يبقى consistent
      const currentToken = token!;
      const currentRole = role ?? 0;
      setAuth({ token: currentToken, role: currentRole, user: res.data as any });
    } catch {
      toast.error("تعذر تحديث البيانات");
    } finally {
      setSaving(false);
    }
  }

  if (meQ.isLoading) return <Loader label="جاري تحميل البيانات..." />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">الملف الشخصي</h1>
        <p className="text-sm text-gray-500">تحديث بيانات الحساب.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="العنوان" value={address} onChange={(e) => setAddress(e.target.value)} className="sm:col-span-2" />
      </div>

      <div className="flex gap-2">
        <Button isLoading={saving} onClick={onSave}>حفظ</Button>
        <Button variant="secondary" onClick={() => meQ.refetch()}>تحديث</Button>
      </div>
    </div>
  );
}