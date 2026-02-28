import i18n from "i18next";
import { initReactI18next } from "react-i18next";

type Locale = "ar" | "en";

const SUPPORTED: Locale[] = ["ar", "en"];
const LOCALE_KEY = "locale";

function normalizeLocale(value: unknown): Locale {
  return value === "en" || value === "ar" ? value : "ar";
}

function toDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

const resources = {
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        shop: "المتجر",
        cart: "السلة",
        admin: "لوحة التحكم",
      },
      common: { search: "ابحث عن منتج...", loading: "جاري التحميل..." },
      shop: { title: "المتجر", empty: "لا توجد منتجات" },
      cart: { title: "سلة التسوق", empty: "سلتك فارغة" },
      home: {
        title: "الرئيسية",
        badge: "تجربة تسوق أسرع وأسهل",
        heroTitle: "اكتشف منتجات مختارة بعناية — بجودة عالية وسعر مناسب",
        heroDesc: "تسوّق أحدث المنتجات، عروض مميزة، وتوصيل سريع. ابدأ الآن!",
        ctaShop: "ابدأ التسوق",
        ctaCart: "اذهب للسلة",
        searchHint: "ابحث بالاسم أو النوع أو العلامة",
        trust1: "دعم مستمر",
        trust2: "عملاء",
        trust3: "توصيل سريع",
        categoriesTitle: "تصفح حسب التصنيف",
        categoriesSub: "اختر القسم اللي يناسبك وابدأ التسوق بسرعة",
        featuredTitle: "منتجات مميزة",
        featuredSub: "اختياراتنا الأفضل لك — زر واحد للسلة وزر للمفضلة",
        viewAll: "عرض الكل",
        viewShop: "إلى المتجر",
        noCategories: "لا توجد تصنيفات حالياً",
        newsTitle: "اشترك لتصلك أحدث العروض",
        newsDesc: "سجل بريدك واحصل على تحديثات وخصومات حصرية.",
        email: "البريد الإلكتروني",
        subscribe: "اشتراك",
      },
      actions: {
        addToCart: "أضف للسلة",
        addFav: "مفضلة",
        removeFav: "إزالة",
      },
      lang: { ar: "ع", en: "EN" },
    },
  },
  en: {
    translation: {
      nav: { home: "Home", shop: "Shop", cart: "Cart", admin: "Dashboard" },
      common: { search: "Search products...", loading: "Loading..." },
      shop: { title: "Shop", empty: "No products found" },
      cart: { title: "Cart", empty: "Your cart is empty" },
      home: {
        title: "Home",
        badge: "Faster, smarter shopping",
        heroTitle: "Discover curated products — quality & value",
        heroDesc: "Shop the latest, best deals, and fast delivery. Start now!",
        ctaShop: "Shop now",
        ctaCart: "Go to cart",
        searchHint: "Search by name, type, or brand",
        trust1: "24/7 Support",
        trust2: "Customers",
        trust3: "Fast Delivery",
        categoriesTitle: "Browse by category",
        categoriesSub: "Pick a category and start shopping",
        featuredTitle: "Featured products",
        featuredSub: "Top picks — cart + favorite buttons",
        viewAll: "View all",
        viewShop: "Go to shop",
        noCategories: "No categories yet",
        newsTitle: "Subscribe for latest deals",
        newsDesc: "Get updates & exclusive discounts.",
        email: "Email",
        subscribe: "Subscribe",
      },
      actions: {
        addToCart: "Add to cart",
        addFav: "Favorite",
        removeFav: "Remove",
      },
      lang: { ar: "AR", en: "EN" },
    },
  },
} as const;

const initialLocale = normalizeLocale(localStorage.getItem(LOCALE_KEY));

i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "ar",
  supportedLngs: SUPPORTED,
  interpolation: { escapeValue: false },
});

function syncDom(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = toDir(locale);
  localStorage.setItem(LOCALE_KEY, locale);
}

// طبّق أول مرة
syncDom(normalizeLocale(i18n.language));

// طبّق كل مرة اللغة تتغير
i18n.on("languageChanged", (lng) => {
  syncDom(normalizeLocale(lng));
});

export default i18n;