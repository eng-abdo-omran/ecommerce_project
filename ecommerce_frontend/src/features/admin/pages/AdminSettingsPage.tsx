import { useState } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("My Store");
  const [shippingFee, setShippingFee] = useState("50");
  const [supportPhone, setSupportPhone] = useState("");

  function save() {
    // لاحقًا تربطه بـ API admin settings
    toast.success("تم حفظ الإعدادات ");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900">إعدادات الأدمن</h1>
        <p className="mt-1 text-sm text-gray-500">
          إعدادات عامة للمتجر والشحن والدفع.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Store */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">إعدادات المتجر</h2>
          <Input
            label="اسم المتجر"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="مثال: Abdelrahman Shop"
          />
          <Input
            label="رقم خدمة العملاء"
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
            placeholder="0100..."
          />
        </div>

        {/* Shipping */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">إعدادات الشحن</h2>
          <Input
            label="سعر الشحن (EGP)"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            placeholder="50"
          />
          <p className="text-xs text-gray-500">
            * تأكد أن نفس القيمة مطبقة في الـ Checkout backend.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}>حفظ</Button>
      </div>
    </div>
  );
}