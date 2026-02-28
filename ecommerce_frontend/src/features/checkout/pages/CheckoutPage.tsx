/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/ui/Button";
import { Select } from "../../../shared/components/ui/Select";
import { Input } from "../../../shared/components/ui/Input";
import { Loader } from "../../../shared/components/ui/Loader";
import { useAuthStore } from "../../../store/auth.store";
import { useMyCart } from "../../cart/hooks/useMyCart";
import { useAddresses } from "../../account/hooks/useAddresses";
import { useCheckout } from "../hooks/useCheckout";

function formatMoney(value: number, locale = "ar-EG", currency = "EGP") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export default function CheckoutPage() {
  const nav = useNavigate();
  const token = useAuthStore((s) => s.token);

  const cartQ = useMyCart(Boolean(token));
  const addrQ = useAddresses(Boolean(token));
  const checkoutMut = useCheckout();

  const items = cartQ.data?.data?.items ?? [];
  const subtotal = cartQ.data?.data?.total ?? 0;

  // Flat shipping (زي ما قلت)
  const shippingFee = useMemo(() => (subtotal > 0 ? 50 : 0), [subtotal]);

  // State للـ form
  const [addressId, setAddressId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [notes, setNotes] = useState("");

  // errors بسيطة
  const addressError = addressId === "" ? "اختر عنوان الشحن" : null;

  const grandTotal = subtotal + shippingFee; // الخصم هيتحسب سيرفر

  const canSubmit =
    items.length > 0 &&
    addressId !== "" &&
    !checkoutMut.isPending &&
    !cartQ.isLoading;

  if (cartQ.isLoading || addrQ.isLoading) {
    return <Loader label="جاري تجهيز صفحة الدفع..." />;
  }

  if (!items.length) {
    return (
      <div className="py-10 space-y-4">
        <div className="text-xl font-bold">سلتك فارغة</div>
        <Button variant="secondary" onClick={() => nav("/shop")}>
          اذهب للمتجر
        </Button>
      </div>
    );
  }

  const addresses = addrQ.data ?? [];

  function submit() {
    if (addressId === "") return;

    checkoutMut.mutate(
      {
        address_id: Number(addressId),
        payment_method: paymentMethod,
        coupon_code: couponCode.trim() ? couponCode.trim() : null,
        notes: notes.trim() ? notes.trim() : null,
      },
      {
        onSuccess: (res: any) => {
          const orderId = res?.data?.order?.id;
          // روح لصفحة تفاصيل الطلب (عندك /account/orders/:id)
          if (orderId) nav(`/account/orders/${orderId}`);
          else nav("/account/orders");
        },
      }
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-extrabold">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">
            أكمل بيانات الشحن والدفع لإتمام الطلب.
          </p>
        </div>

        {/* Address */}
        <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold">عنوان الشحن</h2>
          <Select
            label="اختر عنوان"
            value={addressId}
            onChange={(e) => setAddressId(e.target.value ? Number(e.target.value) : "")}
            error={addressError}
          >
            <option value="">-- اختر --</option>
            {addresses.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.label} - {a.city} - {a.street}
              </option>
            ))}
          </Select>

          <div className="text-xs text-gray-500">
            لو مفيش عنوان، أضفه من صفحة الحساب &gt; العناوين.
          </div>
          <Button variant="secondary" onClick={() => nav("/account/addresses")}>
            إدارة العناوين
          </Button>
        </div>

        {/* Payment */}
        <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold">طريقة الدفع</h2>
          <Select
            label="اختر طريقة الدفع"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "cod" | "online")}
          >
            <option value="cod">الدفع عند الاستلام</option>
            <option value="online">أونلاين</option>
          </Select>

          {paymentMethod === "online" ? (
            <p className="text-xs text-gray-500">
              الدفع الأونلاين سيتم تفعيله حسب بوابة الدفع (Paymob/Stripe...) لاحقًا.
            </p>
          ) : null}
        </div>

        {/* Coupon + notes */}
        <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold">خصم وملاحظات</h2>
          <Input
            label="كوبون خصم (اختياري)"
            placeholder="SAVE10"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Input
            label="ملاحظات (اختياري)"
            placeholder="اتصل قبل الوصول..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            الخصم يتم حسابه على السيرفر لضمان عدم التلاعب.
          </p>
        </div>
      </div>

      {/* Right: summary */}
      <aside className="rounded-3xl border bg-white p-5 shadow-sm h-fit space-y-4">
        <h2 className="text-lg font-extrabold">ملخص الطلب</h2>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-900">{formatMoney(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-gray-700">
            <span>Shipping</span>
            <span className="font-semibold text-gray-900">{formatMoney(shippingFee)}</span>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex items-center justify-between text-gray-900">
            <span className="font-semibold">Total (قبل الخصم)</span>
            <span className="text-base font-extrabold">{formatMoney(grandTotal)}</span>
          </div>

          <p className="text-xs text-gray-500">
            الخصم النهائي يظهر بعد إنشاء الطلب (يتم حسابه في الـ API).
          </p>
        </div>

        <Button className="w-full" isLoading={checkoutMut.isPending} onClick={submit} disabled={!canSubmit}>
          تأكيد الطلب
        </Button>

        {checkoutMut.isPending ? (
          <p className="text-xs text-gray-500">جاري إنشاء الطلب والتحقق من المخزون...</p>
        ) : null}
      </aside>
    </div>
  );
}