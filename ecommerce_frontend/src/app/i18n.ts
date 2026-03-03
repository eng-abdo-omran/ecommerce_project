import i18n from "i18next";
import { initReactI18next } from "react-i18next";

type Locale = "ar" | "en";

const SUPPORTED: Locale[] = ["ar", "en"];
const LOCALE_KEY = "locale";

function normalizeLocale(value: unknown): Locale {
  // ✅ default = English
  return value === "en" || value === "ar" ? value : "en";
}

function toDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

const resources = {
  en: {
    translation: {
      brand: { name: "Ecommerce" },

      lang: { ar: "AR", en: "EN" },

      nav: {
        home: "Home",
        shop: "Shop",
        cart: "Cart",
        admin: "Dashboard",
        account: "Account",
        favorites: "Favorites",
      },

      common: {
        search: "Search products...",
        loading: "Loading...",
        error: "Something went wrong",
        retry: "Retry",
        updating: "Updating...",
        updatingDots: "...",
        toggleLanguage: "Toggle language",
        toggleMenu: "Toggle menu",
        closeMenu: "Close menu",
        noImage: "No image",
        na: "—",
        clear: "Clear",
      },

      actions: {
        addToCart: "Add to cart",
        addFav: "Favorite",
        removeFav: "Remove",
        remove: "Remove",
        chooseOptions: "Choose options",
      },

      home: {
        title: "Home",
        badge: "Faster, smarter shopping",
        heroTitle: "A modern store experience — curated products at the best value",
        heroDesc: "Clear categories, high-quality products, and one-click add to cart/favorites.",
        ctaShop: "Shop now",
        ctaCart: "Go to cart",
        ctaFav: "View favorites",
        searchHint: "Search by name, type, or brand",

        trustSupportValue: "24/7",
        trustSupportLabel: "Always support",
        trustFastValue: "Fast",
        trustFastLabel: "Fast delivery",
        trustSecureValue: "Secure",
        trustSecureLabel: "Secure experience",

        categoriesTitle: "Browse by category",
        categoriesSub: "Pick a category and start shopping",
        featuredTitle: "Featured products",
        featuredSub: "Top picks — cart + favorite buttons",
        viewAll: "View all",
        viewShop: "Go to shop",
        noCategories: "No categories yet",

        card1: "Today's picks",
        card1b: "Top Picks",
        card2: "One-click add",
        card2b: "Cart & Favorites",
        card3: "Modern UI",
        card3b: "And a great user experience",
        card3c: "Browse products",

        newArrivalsTitle: "New arrivals",
        newArrivalsSub: "Latest additions to the shop",
        bestSellersTitle: "Best sellers",
        bestSellersSub: "Products with high demand",

        newsTitle: "Subscribe for the latest deals",
        newsDesc: "Enter your email and get updates & exclusive discounts.",
        email: "Email",
        subscribe: "Subscribe",
      },

      shop: {
        title: "Shop",
        empty: "No products found",

        filters: "Filters",
        filtersTitle: "Filters",
        apply: "Apply",
        clearAll: "Clear all",

        noProductsTitle: "No products found",
        noProductsDesc: "Try adjusting the filters or clearing them.",
        hint: "Tip: You can remove a single filter from the chips above instead of clearing all.",

        shareHint: "💡 You can share the shop link and keep the same active filters (Query String).",

        infinity: "∞",

        chips: {
          search: "Search: {{value}}",
          category: "Category: {{value}}",
          price: "Price: {{min}} - {{max}}",
          sort: "Sort: {{label}}",
          removeTitle: "Remove filter",
        },

        toolbar: {
          resultsLabel: "Results:",
          productUnit: "products",
          pageOf: "Page {{page}} of {{last}}",
        },

        filter: {
          searchLabel: "Search",
          categoryLabel: "Category",
          allCategories: "All categories",
          categoryWithCount: "{{name}} ({{count}})",
          priceLabel: "Price",
          minPrice: "Min price",
          maxPrice: "Max price",
          sortLabel: "Sort",
        },

        sort: {
          latest: "Latest",
          priceAsc: "Price ↑",
          priceDesc: "Price ↓",
          nameAsc: "Name A–Z",
          nameDesc: "Name Z–A",

          priceAscLong: "Price: low to high",
          priceDescLong: "Price: high to low",
          nameAscLong: "Name: A–Z",
          nameDescLong: "Name: Z–A",
        },
      },

      cart: {
        title: "Cart",
        empty: "Your cart is empty",
        emptyDesc: "Start adding products from the shop and they will appear here.",

        loadErrorTitle: "Failed to load cart",

        itemsCount: "Items:",
        clear: "Clear cart",
        checkout: "Checkout",

        decreaseQty: "Decrease quantity",
        increaseQty: "Increase quantity",
        viewProduct: "View product",

        lineTotal: "Line total:",
        summary: "Order summary",
        subtotal: "Subtotal",
        shipping: "Shipping",
        free: "Free",
        total: "Total",

        discountNote: "* Discount (if any) is calculated on the checkout page on the server for accuracy.",
        note: "Note: The final price will be confirmed after stock verification.",

        continue: "Continue shopping",
        grandTotalLabel: "Total",

        added: "Added to cart",
        addFailed: "Failed to add to cart",

        // optional toast from ProductCard older versions (safe to keep)
        chooseOptionsHint: "Please choose options first (e.g., color/size)...",
      },

      favorites: {
        title: "Favorites",
        empty: "No favorite products yet",
        emptyDesc: "Start adding products to your favorites from the shop.",
        count: "Products count:",

        toggle: "Toggle favorite",
        addTitle: "Add to favorites",
        removeTitle: "Remove from favorites",

        toggleFailed: "Failed to update favorites",
        added: "Added to favorites",
        removed: "Removed from favorites",

        add: "Add to favorites",
        remove: "Remove from favorites",
      },

      product: {
        notFound: "Failed to load product",
        notFoundDesc: "Try again or go back to the shop.",
        defaultTitle: "Product",

        share: "Share / Copy link",
        linkCopied: "Link copied ✅",
        copyPrompt: "Copy link:",

        sku: "SKU:",
        category: "Category:",

        options: "Options",
        option: "Option {{n}}",
        value: "Value {{n}}",
        selectAllOptionsHint: "Choose all required options before adding to cart.",
        selectAllOptionsToast: "Please choose all required options (e.g., color/size).",

        // from ProductCard
        selectOptionsHint: "Please choose options first (e.g., color/size)...",
        hasOptions: "This product has options (e.g., color/size)",
        hasVariants: "Has options",

        quantity: "Quantity",
        increase: "Increase",
        decrease: "Decrease",
        invalidQty: "Invalid quantity",

        details: "Details",
        features: "Features",

        previewImage: "Image preview",
        priceLabel: "Price",

        related: "Related products",
        viewMore: "View more",
        noRelated: "No related products right now",
      },

      admin: {
        nav: {
          overview: "Overview",
          users: "Users",
          orders: "Orders",
          categories: "Categories",
          brands: "Brands",
          suppliers: "Suppliers",
          products: "Products",
          offers: "Offers",
          coupons: "Coupons",
          customers: "Customers",
          stores: "Stores",
          reviews: "Reviews",
          settings: "Settings",
        },

        top: {
          title: "Admin Dashboard",
          brand: "Ecommerce",
          adminPanel: "Admin Panel",

          home: "Home",
          shop: "Shop",
          cart: "Cart",
          settings: "Settings",
          openStore: "Open Store",

          homeTitle: "Go to Home",
          shopTitle: "Go to Shop",
          cartTitle: "Go to Cart",
          settingsTitle: "Admin Settings",
          openStoreTitle: "Open Store in new tab",

          switchToEnglish: "Switch to English",
          switchToArabic: "Switch to Arabic",

          welcome: "Welcome back{{name}} — manage your store",
          subtitle: "",

          viewOrders: "View Orders",
          manageProducts: "Manage Products",
          logout: "Logout",
          adminUI: "Admin UI",
        },

        overview: {
          loading: "Loading overview...",
          failed: "Failed to load overview",
          retry: "Retry",

          breadcrumb: "Admin / Overview",
          title: "Overview",
          subtitle: "Quick snapshot of orders, revenue and inventory health.",

          kpis: {
            ordersToday: "Orders Today",
            ordersTodaySub: "Number of orders created today",
            revenueToday: "Revenue Today",
            revenueTodaySub: "Sum of today orders totals",
            ordersMonth: "Orders This Month",
            ordersMonthSub: "Orders since month start",
            revenueMonth: "Revenue This Month",
            revenueMonthSub: "Revenue since month start",
            products: "Products",
            productsSub: "Total products in catalog",
            customers: "Customers",
            customersSub: "Total customers count",
          },

          revenueTitle: "Revenue (Last 7 days)",
          revenueSub: "Mini chart based on daily totals",

          ordersByStatus: "Orders by Status",
          openOrders: "Open Orders",

          recentOrders: "Recent Orders",
          recentOrdersSub: "Last 8 orders",
          viewAll: "View all",

          lowStock: "Low Stock",
          lowStockSub: "Products near out-of-stock",
          manage: "Manage",

          price: "Price:",
          qty: "Qty:",
          restock: "Restock Products",
        },

        status: {
          pending: "Pending",
          processing: "Processing",
          shipped: "Shipped",
          completed: "Completed",
          cancelled: "Cancelled",
        },
      },
    },
  },

  ar: {
    translation: {
      brand: { name: "Ecommerce" },

      lang: { ar: "ع", en: "EN" },

      nav: {
        home: "الرئيسية",
        shop: "المتجر",
        cart: "السلة",
        admin: "لوحة التحكم",
        account: "حسابي",
        favorites: "المفضلة",
      },

      common: {
        search: "ابحث عن منتج...",
        loading: "جاري التحميل...",
        error: "حدث خطأ",
        retry: "إعادة المحاولة",
        updating: "جارِ التحديث...",
        updatingDots: "...",
        toggleLanguage: "تبديل اللغة",
        toggleMenu: "قائمة",
        closeMenu: "إغلاق القائمة",
        noImage: "لا توجد صورة",
        na: "—",
        clear: "مسح",
      },

      actions: {
        addToCart: "أضف للسلة",
        addFav: "مفضلة",
        removeFav: "إزالة",
        remove: "حذف",
        chooseOptions: "اختر الخيارات",
      },

      home: {
        title: "الرئيسية",
        badge: "تجربة تسوق أسرع وأسهل",
        heroTitle: "تجربة متجر حديثة — منتجات مختارة بعناية وبأفضل قيمة",
        heroDesc: "تصنيفات واضحة، منتجات بجودة عالية، وإضافة للسلة/المفضلة بضغطة واحدة.",
        ctaShop: "ابدأ التسوق",
        ctaCart: "اذهب للسلة",
        ctaFav: "شاهد المفضلة",
        searchHint: "ابحث بالاسم أو النوع أو العلامة",

        trustSupportValue: "24/7",
        trustSupportLabel: "دعم مستمر",
        trustFastValue: "سريع",
        trustFastLabel: "توصيل سريع",
        trustSecureValue: "آمن",
        trustSecureLabel: "تجربة آمنة",

        categoriesTitle: "تصفح حسب التصنيف",
        categoriesSub: "اختر القسم اللي يناسبك وابدأ التسوق بسرعة",
        featuredTitle: "منتجات مميزة",
        featuredSub: "اختياراتنا الأفضل لك — زر للسلة وزر للمفضلة",
        viewAll: "عرض الكل",
        viewShop: "إلى المتجر",
        noCategories: "لا توجد تصنيفات حالياً",

        card1: "مختارات اليوم",
        card1b: "الأفضل اليوم",
        card2: "أضف بضغطة",
        card2b: "السلة والمفضلة",
        card3: "واجهة مودرن",
        card3b: "وتجربة استخدام ممتازة",
        card3c: "تصفح المنتجات",

        newArrivalsTitle: "وصل حديثًا",
        newArrivalsSub: "أحدث الإضافات إلى المتجر",
        bestSellersTitle: "الأكثر مبيعًا",
        bestSellersSub: "منتجات عليها طلب عالي",

        newsTitle: "اشترك لتصلك أحدث العروض",
        newsDesc: "سجل بريدك واحصل على تحديثات وخصومات حصرية.",
        email: "البريد الإلكتروني",
        subscribe: "اشتراك",
      },

      shop: {
        title: "المتجر",
        empty: "لا توجد منتجات",

        filters: "فلاتر",
        filtersTitle: "الفلاتر",
        apply: "تطبيق",
        clearAll: "مسح الكل",

        noProductsTitle: "لا توجد منتجات",
        noProductsDesc: "جرّب تغيير الفلاتر أو مسحها.",
        hint: "تلميح: تقدر تمسح فلتر واحد من الـ Chips بالأعلى بدل مسح الكل.",

        shareHint: "💡 تقدر تشارك لينك المتجر وهو نفس الفلاتر شغالة (Query String).",

        infinity: "∞",

        chips: {
          search: "بحث: {{value}}",
          category: "تصنيف: {{value}}",
          price: "سعر: {{min}} - {{max}}",
          sort: "ترتيب: {{label}}",
          removeTitle: "إزالة الفلتر",
        },

        toolbar: {
          resultsLabel: "النتائج:",
          productUnit: "منتج",
          pageOf: "صفحة {{page}} من {{last}}",
        },

        filter: {
          searchLabel: "بحث",
          categoryLabel: "التصنيف",
          allCategories: "كل التصنيفات",
          categoryWithCount: "{{name}} ({{count}})",
          priceLabel: "السعر",
          minPrice: "أقل سعر",
          maxPrice: "أعلى سعر",
          sortLabel: "الترتيب",
        },

        sort: {
          latest: "الأحدث",
          priceAsc: "السعر ↑",
          priceDesc: "السعر ↓",
          nameAsc: "الاسم أ-ي",
          nameDesc: "الاسم ي-أ",

          priceAscLong: "السعر: من الأقل للأعلى",
          priceDescLong: "السعر: من الأعلى للأقل",
          nameAscLong: "الاسم: أ-ي",
          nameDescLong: "الاسم: ي-أ",
        },
      },

      cart: {
        title: "سلة التسوق",
        empty: "سلتك فارغة",
        emptyDesc: "ابدأ بإضافة منتجات من المتجر، وستظهر هنا.",
        loadErrorTitle: "تعذر تحميل السلة",

        itemsCount: "عدد العناصر:",
        clear: "تفريغ السلة",
        checkout: "إتمام الشراء",

        decreaseQty: "تقليل الكمية",
        increaseQty: "زيادة الكمية",
        viewProduct: "عرض المنتج",

        lineTotal: "الإجمالي:",
        summary: "ملخص الطلب",
        subtotal: "الإجمالي الفرعي",
        shipping: "الشحن",
        free: "مجاني",
        total: "الإجمالي",

        discountNote: "* الخصم (إن وجد) يتم حسابه في صفحة الدفع على السيرفر لضمان الدقة.",
        note: "ملاحظة: سيتم تأكيد السعر النهائي بعد التحقق من المخزون.",
        continue: "متابعة التسوق",
        grandTotalLabel: "الإجمالي",

        added: "تمت الإضافة إلى السلة",
        addFailed: "تعذر إضافة المنتج للسلة",

        chooseOptionsHint: "اختر الخيارات أولاً (مثل اللون/المقاس)...",
      },

      favorites: {
        title: "المفضلة",
        empty: "لا توجد منتجات في المفضلة",
        emptyDesc: "ابدأ بإضافة منتجات للمفضلة من المتجر.",
        count: "عدد المنتجات:",

        toggle: "تبديل المفضلة",
        addTitle: "إضافة للمفضلة",
        removeTitle: "إزالة من المفضلة",

        toggleFailed: "تعذر تحديث المفضلة",
        added: "تمت الإضافة للمفضلة",
        removed: "تمت الإزالة من المفضلة",

        add: "إضافة للمفضلة",
        remove: "إزالة من المفضلة",
      },

      product: {
        notFound: "تعذر تحميل المنتج",
        notFoundDesc: "حاول مرة أخرى أو ارجع للمتجر.",
        defaultTitle: "منتج",

        share: "مشاركة / نسخ الرابط",
        linkCopied: "تم نسخ الرابط ✅",
        copyPrompt: "انسخ الرابط:",

        sku: "SKU:",
        category: "التصنيف:",

        options: "الخيارات",
        option: "خيار {{n}}",
        value: "قيمة {{n}}",
        selectAllOptionsHint: "اختر كل الخيارات المطلوبة قبل الإضافة للسلة.",
        selectAllOptionsToast: "من فضلك اختر كل الخيارات المطلوبة (مثل اللون/المقاس).",

        selectOptionsHint: "اختر الخيارات أولاً (مثل اللون/المقاس)...",
        hasOptions: "هذا المنتج له خيارات مثل اللون/المقاس",
        hasVariants: "له خيارات",

        quantity: "الكمية",
        increase: "زيادة",
        decrease: "تقليل",
        invalidQty: "الكمية غير صحيحة",

        details: "التفاصيل",
        features: "المميزات",

        previewImage: "معاينة الصورة",
        priceLabel: "السعر",

        related: "منتجات مشابهة",
        viewMore: "عرض المزيد",
        noRelated: "لا توجد منتجات مشابهة حالياً",
      },

      admin: {
        nav: {
          overview: "نظرة عامة",
          users: "المستخدمون",
          orders: "الطلبات",
          categories: "التصنيفات",
          brands: "العلامات",
          suppliers: "الموردون",
          products: "المنتجات",
          offers: "العروض",
          coupons: "القسائم",
          customers: "العملاء",
          stores: "المتاجر",
          reviews: "المراجعات",
          settings: "الإعدادات",
        },

        top: {
          title: "لوحة التحكم",
          brand: "Ecommerce",
          adminPanel: "لوحة المشرف",

          home: "الرئيسية",
          shop: "المتجر",
          cart: "السلة",
          settings: "الإعدادات",
          openStore: "فتح المتجر",

          homeTitle: "اذهب إلى الرئيسية",
          shopTitle: "اذهب إلى المتجر",
          cartTitle: "اذهب إلى السلة",
          settingsTitle: "إعدادات المشرف",
          openStoreTitle: "افتح المتجر في تبويب جديد",

          switchToEnglish: "التحويل للإنجليزية",
          switchToArabic: "التحويل للعربية",

          welcome: "مرحباً بعودتك{{name}} — إدارة متجرك",
          subtitle: "",

          viewOrders: "عرض الطلبات",
          manageProducts: "إدارة المنتجات",
          logout: "تسجيل الخروج",
          adminUI: "واجهة المشرف",
        },

        overview: {
          loading: "جاري تحميل الملخص...",
          failed: "فشل في تحميل الملخص",
          retry: "إعادة المحاولة",

          breadcrumb: "المشرف / نظرة عامة",
          title: "نظرة عامة",
          subtitle: "لمحة سريعة عن الطلبات والإيرادات وصحة المخزون.",

          kpis: {
            ordersToday: "الطلبات اليوم",
            ordersTodaySub: "عدد الطلبات المُنشأة اليوم",
            revenueToday: "إيرادات اليوم",
            revenueTodaySub: "مجموع إجماليات طلبات اليوم",
            ordersMonth: "الطلبات هذا الشهر",
            ordersMonthSub: "الطلبات منذ بداية الشهر",
            revenueMonth: "إيرادات هذا الشهر",
            revenueMonthSub: "الإيرادات منذ بداية الشهر",
            products: "المنتجات",
            productsSub: "إجمالي المنتجات في الكتالوج",
            customers: "العملاء",
            customersSub: "إجمالي عدد العملاء",
          },

          revenueTitle: "الإيرادات (آخر 7 أيام)",
          revenueSub: "مخطط صغير بناءً على الإجماليات اليومية",

          ordersByStatus: "الطلبات حسب الحالة",
          openOrders: "فتح الطلبات",

          recentOrders: "أحدث الطلبات",
          recentOrdersSub: "آخر 8 طلبات",
          viewAll: "عرض الكل",

          lowStock: "المخزون المنخفض",
          lowStockSub: "منتجات قاربت على النفاذ",
          manage: "إدارة",

          price: "السعر:",
          qty: "الكمية:",
          restock: "إعادة تخزين المنتجات",
        },

        status: {
          pending: "قيد الانتظار",
          processing: "قيد المعالجة",
          shipped: "تم الشحن",
          completed: "مكتمل",
          cancelled: "ملغي",
        },
      },
    },
  },
} as const;

const initialLocale = normalizeLocale(localStorage.getItem(LOCALE_KEY));

i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "en",
  supportedLngs: SUPPORTED,
  interpolation: { escapeValue: false },
});

function syncDom(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = toDir(locale);
  localStorage.setItem(LOCALE_KEY, locale);
}

// Apply once
syncDom(normalizeLocale(i18n.language));

// Apply on each change
i18n.on("languageChanged", (lng) => {
  syncDom(normalizeLocale(lng));
});

export default i18n;