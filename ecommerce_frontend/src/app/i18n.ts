import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
      home: { title: "الرئيسية" },
      lang: { ar: "ع", en: "EN" },
    },
    actions: {
      addToCart: "أضف للسلة",
      addFav: "مفضلة",
      removeFav: "إزالة",
    },
    home: {
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
  },
  en: {
    translation: {
      nav: { home: "Home", shop: "Shop", cart: "Cart", admin: "Dashboard" },
      common: { search: "Search products...", loading: "Loading..." },
      shop: { title: "Shop", empty: "No products found" },
      cart: { title: "Cart", empty: "Your cart is empty" },
      home: { title: "Home" },
      lang: { ar: "AR", en: "EN" },
    },
    actions: {
      addToCart: "Add to cart",
      addFav: "Favorite",
      removeFav: "Remove",
    },
    home: {
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
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("locale") || "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
});

export default i18n;
