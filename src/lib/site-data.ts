import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

export type PropertyType =
  | "apartment"
  | "villa"
  | "chalet"
  | "penthouse"
  | "townhouse"
  | "twinhouse"
  | "duplex"
  | "ivilla"
  | "cabana"
  | "studio";

export type PropertyTag =
  | "featured"
  | "underMarket"
  | "ready"
  | "installments"
  | "prime"
  | "bestDeal"
  | "limited"
  | "exclusive";

export type Property = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  locationSlug: string;
  locationName: LocalizedText;
  compound: LocalizedText;
  propertyType: PropertyType;
  price: number;
  priceLabel: LocalizedText;
  size: number;
  bedrooms: number;
  bathrooms: number;
  finishing: LocalizedText;
  paymentPlan: LocalizedText;
  delivery: LocalizedText;
  deliveryYear: number;
  isReady: boolean;
  installmentYears: number;
  tags: PropertyTag[];
  gallery: string[];
  amenities: LocalizedText[];
  nearby: LocalizedText[];
  investmentAngle: LocalizedText;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPhone?: string;
  listingType?: "sale" | "rent";
  source?: "built-in" | "managed";
};

export type LocationGuide = {
  slug: string;
  name: LocalizedText;
  heroTitle: LocalizedText;
  heroDescription: LocalizedText;
  overview: LocalizedText;
  whyInvest: LocalizedText[];
  propertyTypes: PropertyType[];
  featuredPropertySlugs: string[];
  highlights: Array<{
    label: LocalizedText;
    value: LocalizedText;
  }>;
  image: string;
};

export const propertyTypeLabels: Record<PropertyType, LocalizedText> = {
  apartment: { ar: "شقة", en: "Apartment" },
  villa: { ar: "فيلا", en: "Villa" },
  chalet: { ar: "شاليه", en: "Chalet" },
  penthouse: { ar: "بنتهاوس", en: "Penthouse" },
  townhouse: { ar: "تاون هاوس", en: "Townhouse" },
  twinhouse: { ar: "توين هاوس", en: "Twin House" },
  duplex: { ar: "دوبلكس", en: "Duplex" },
  ivilla: { ar: "اي فيلا", en: "iVilla" },
  cabana: { ar: "كبانه", en: "Cabana" },
  studio: { ar: "استوديو", en: "Studio" },
};

export const companyProfile = {
  name: {
    ar: "Image Investments | ايمدج للاستثمارات",
    en: "Image Investments | Real Estate Advisory",
  },
  shortName: "Image Investments",
  phoneDisplay: "+20 109 109 6255",
  phoneHref: "tel:+201091096255",
  whatsappNumber: "201091096255",
  whatsappHref:
    "https://wa.me/201091096255?text=مرحبًا، أرغب في معرفة أفضل الفرص العقارية المتاحة لديكم.",
  email: "image.investments.eg@gmail.com",
  officeAddress: {
    ar: "17 شارع الطاقه، مدينة نصر، القاهرة، مصر",
    en: "17 El Taqa Street, Nasr City, Cairo, Egypt",
  },
  hours: {
    ar: "السبت إلى الخميس | 10:00 ص - 8:00 م",
    en: "Saturday to Thursday | 10:00 AM - 8:00 PM",
  },
  socialLinks: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/1AWbkEhLZw/",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@image_investments",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/201091096255",
    },
  ],
};

const lagoonGallery = [
  "/properties/lagoon-villa/1.jpg",
  "/properties/lagoon-villa/2.jpg",
  "/properties/lagoon-villa/3.jpg",
  "/properties/lagoon-villa/4.jpg",
  "/properties/lagoon-villa/5.jpg",
  "/properties/lagoon-villa/6.jpg",
  "/properties/lagoon-villa/7.jpg",
];

const bayGallery = [
  "/properties/bay-chalet/1.jpg",
  "/properties/bay-chalet/2.jpg",
  "/properties/bay-chalet/3.jpg",
  "/properties/bay-chalet/4.jpg",
  "/properties/bay-chalet/5.jpg",
];

export const legacyProperties: Property[] = [
  {
    slug: "lagoon-villa-hacienda-bay",
    title: {
      ar: "فيلا لاجون فاخرة في هاسيندا باي",
      en: "Luxury Lagoon Villa at Hacienda Bay",
    },
    summary: {
      ar: "فيلا مستقلة بإطلالة مباشرة على اللاجون مع تشطيب فاخر ومسبح خاص.",
      en: "Standalone luxury villa with a direct lagoon view and a private pool.",
    },
    description: {
      ar: "فرصة مميزة لعشاق الخصوصية والرفاهية في أحد أقوى منتجعات الساحل الشمالي. الوحدة مناسبة للاستخدام الشخصي عالي المستوى أو كأصل استثماري قوي في سوق الإيجار الموسمي.",
      en: "A premium North Coast opportunity for buyers seeking privacy, prestige, and a strong seasonal rental asset inside one of Egypt's top summer destinations.",
    },
    locationSlug: "north-coast",
    locationName: { ar: "الساحل الشمالي", en: "North Coast" },
    compound: { ar: "هاسيندا باي", en: "Hacienda Bay" },
    propertyType: "villa",
    price: 29500000,
    priceLabel: { ar: "29,500,000 جنيه", en: "EGP 29,500,000" },
    size: 365,
    bedrooms: 4,
    bathrooms: 6,
    finishing: { ar: "تشطيب كامل مع تكييفات", en: "Fully finished with ACs" },
    paymentPlan: {
      ar: "15% مقدم وتقسيط حتى 6 سنوات",
      en: "15% down payment over 6 years",
    },
    delivery: { ar: "جاهز للاستلام", en: "Ready to move" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 6,
    tags: ["featured", "ready", "underMarket", "prime", "bestDeal"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "مسبح خاص", en: "Private swimming pool" },
      { ar: "إطلالة مفتوحة على اللاجون", en: "Direct open lagoon view" },
      { ar: "غرفة مربية وغرفة سائق", en: "Nanny and driver rooms" },
      { ar: "موقف سيارات خاص", en: "Private parking" },
    ],
    nearby: [
      { ar: "نادي الشاطئ", en: "Beach club" },
      { ar: "مناطق مطاعم راقية", en: "Upscale dining spots" },
      { ar: "مركز خدمات متكامل", en: "Integrated service hub" },
    ],
    investmentAngle: {
      ar: "مناسب لعملاء الاستثمار المصيفي الباحثين عن أصل قابل للتأجير الموسمي بعائد قوي.",
      en: "Ideal for premium seasonal investment with strong rental positioning.",
    },
    coordinates: { lat: 30.9824, lng: 28.7324 },
  },
  {
    slug: "bay-chalet-hacienda-bay",
    title: {
      ar: "شاليه مميز بالقرب من البحر في هاسيندا باي",
      en: "Prime Chalet Near the Sea at Hacienda Bay",
    },
    summary: {
      ar: "شاليه مصيفي بموقع قريب من البحر والبول مع طلب قوي في الإيجارات الصيفية.",
      en: "A summer chalet close to the sea and pool with strong seasonal rental demand.",
    },
    description: {
      ar: "وحدة جاهزة للتسويق السريع أو الاستخدام العائلي داخل مشروع معروف بقيمة إعادة البيع المرتفعة وبتجربة مصيفية راقية.",
      en: "A highly marketable family chalet in a resort known for premium summer demand and solid resale value.",
    },
    locationSlug: "north-coast",
    locationName: { ar: "الساحل الشمالي", en: "North Coast" },
    compound: { ar: "هاسيندا باي", en: "Hacienda Bay" },
    propertyType: "chalet",
    price: 11900000,
    priceLabel: { ar: "11,900,000 جنيه", en: "EGP 11,900,000" },
    size: 198,
    bedrooms: 3,
    bathrooms: 4,
    finishing: { ar: "تشطيب فاخر", en: "Luxury finished" },
    paymentPlan: {
      ar: "10% مقدم وتقسيط حتى 7 سنوات",
      en: "10% down payment over 7 years",
    },
    delivery: { ar: "صيف 2026", en: "Summer 2026" },
    deliveryYear: 2026,
    isReady: false,
    installmentYears: 7,
    tags: ["featured", "installments", "prime", "exclusive"],
    gallery: bayGallery,
    amenities: [
      { ar: "قريب من البحر", en: "Close to the sea" },
      { ar: "رووف خاص", en: "Private roof" },
      { ar: "موقفان للسيارات", en: "Two parking spaces" },
      { ar: "مفروشات قابلة للتجهيز السريع", en: "Fast furnishing potential" },
    ],
    nearby: [
      { ar: "مناطق ترفيهية", en: "Entertainment zones" },
      { ar: "حمامات سباحة", en: "Swimming pools" },
      { ar: "خدمات شاطئية", en: "Beach services" },
    ],
    investmentAngle: {
      ar: "شاليه بعائد موسمي ممتاز وسهولة في إعادة التسويق للمستثمرين والمستخدم النهائي.",
      en: "A strong seasonal-yield chalet with excellent liquidity for resale or rental.",
    },
    coordinates: { lat: 30.9828, lng: 28.7308 },
  },
  {
    slug: "new-cairo-skyline-apartment",
    title: {
      ar: "شقة استثمارية في القاهرة الجديدة بالقرب من محور بن زايد",
      en: "Investment Apartment in New Cairo near Bin Zayed Axis",
    },
    summary: {
      ar: "شقة عائلية في موقع حيوي تناسب السكن والاستثمار طويل الأجل.",
      en: "A family-oriented apartment in a strategic New Cairo address for end users and investors.",
    },
    description: {
      ar: "وحدة بمساحة عملية داخل مجتمع سكني متكامل مع فرص نمو قوية بفضل الطلب المرتفع في شرق القاهرة.",
      en: "A practical family apartment inside an integrated community with strong East Cairo demand fundamentals.",
    },
    locationSlug: "new-cairo",
    locationName: { ar: "القاهرة الجديدة", en: "New Cairo" },
    compound: { ar: "كمبوند سكاي لاين", en: "Skyline Compound" },
    propertyType: "apartment",
    price: 7850000,
    priceLabel: { ar: "7,850,000 جنيه", en: "EGP 7,850,000" },
    size: 175,
    bedrooms: 3,
    bathrooms: 3,
    finishing: { ar: "نصف تشطيب", en: "Semi-finished" },
    paymentPlan: {
      ar: "5% مقدم وتقسيط حتى 8 سنوات",
      en: "5% down payment over 8 years",
    },
    delivery: { ar: "2027", en: "2027" },
    deliveryYear: 2027,
    isReady: false,
    installmentYears: 8,
    tags: ["featured", "installments", "underMarket"],
    gallery: bayGallery,
    amenities: [
      { ar: "نادي اجتماعي", en: "Clubhouse" },
      { ar: "مساحات خضراء", en: "Landscaped open spaces" },
      { ar: "بوابات أمنية", en: "Gated security" },
      { ar: "مواقف تحت الأرض", en: "Underground parking" },
    ],
    nearby: [
      { ar: "الجامعة الأمريكية", en: "The American University in Cairo" },
      { ar: "التجمع الخامس", en: "Fifth Settlement" },
      { ar: "محور بن زايد", en: "Bin Zayed Axis" },
    ],
    investmentAngle: {
      ar: "خيار قوي لمن يبحث عن شقة في منطقة ذات طلب سكني مستمر وعائد إعادة بيع جيد.",
      en: "A compelling apartment play in a high-demand residential submarket.",
    },
    coordinates: { lat: 30.0176, lng: 31.4913 },
  },
  {
    slug: "capital-view-penthouse",
    title: {
      ar: "بنتهاوس بإطلالة بانورامية في العاصمة الإدارية",
      en: "Panoramic Penthouse in the New Capital",
    },
    summary: {
      ar: "بنتهاوس فاخر داخل مشروع ذكي في قلب العاصمة الإدارية الجديدة.",
      en: "A luxury penthouse inside a smart community in the New Administrative Capital.",
    },
    description: {
      ar: "وحدة مناسبة للمشترين الباحثين عن منتج نادر في العاصمة الإدارية يجمع بين الرفاهية والمساحة الخارجية.",
      en: "A rare luxury product in the New Capital combining outdoor space and premium finishing potential.",
    },
    locationSlug: "new-capital",
    locationName: { ar: "العاصمة الإدارية", en: "New Capital" },
    compound: { ar: "كابيتال فيو", en: "Capital View" },
    propertyType: "penthouse",
    price: 14200000,
    priceLabel: { ar: "14,200,000 جنيه", en: "EGP 14,200,000" },
    size: 230,
    bedrooms: 4,
    bathrooms: 4,
    finishing: { ar: "عظم (Core & Shell)", en: "Core & shell" },
    paymentPlan: {
      ar: "10% مقدم وتقسيط حتى 9 سنوات",
      en: "10% down payment over 9 years",
    },
    delivery: { ar: "2028", en: "2028" },
    deliveryYear: 2028,
    isReady: false,
    installmentYears: 9,
    tags: ["featured", "installments", "prime", "limited"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "تراس واسع", en: "Large private terrace" },
      { ar: "سمارت هوم", en: "Smart home readiness" },
      { ar: "مداخل فندقية", en: "Hotel-style lobbies" },
      { ar: "منطقة أعمال قريبة", en: "Close to the business district" },
    ],
    nearby: [
      { ar: "الحي المالي", en: "Financial district" },
      { ar: "الحي الحكومي", en: "Government district" },
      { ar: "البرج الأيقوني", en: "Iconic Tower" },
    ],
    investmentAngle: {
      ar: "منتج نادر مناسب للمستثمرين الذين يستهدفون شريحة عالية الدخل وسوق إعادة بيع مميز.",
      en: "A scarce premium asset designed for affluent buyers and strong future resale positioning.",
    },
    coordinates: { lat: 30.0089, lng: 31.7284 },
  },
  {
    slug: "zayed-signature-villa",
    title: {
      ar: "فيلا جاهزة في الشيخ زايد داخل كمبوند راقٍ",
      en: "Ready Signature Villa in Sheikh Zayed",
    },
    summary: {
      ar: "فيلا عائلية في غرب القاهرة مع جاهزية للسكن وموقع قريب من المحاور الرئيسية.",
      en: "A ready-to-move family villa in West Cairo close to the main road network.",
    },
    description: {
      ar: "حل متوازن بين الرفاهية العملية وسرعة الاستلام في واحدة من أكثر مناطق غرب القاهرة طلبًا من العائلات والمستثمرين.",
      en: "A balanced lifestyle and investment product offering immediate usability in one of West Cairo's strongest family markets.",
    },
    locationSlug: "sheikh-zayed",
    locationName: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    compound: { ar: "زايد سيجنتشر", en: "Zayed Signature" },
    propertyType: "villa",
    price: 24800000,
    priceLabel: { ar: "24,800,000 جنيه", en: "EGP 24,800,000" },
    size: 320,
    bedrooms: 4,
    bathrooms: 5,
    finishing: { ar: "تشطيب كامل", en: "Fully finished" },
    paymentPlan: {
      ar: "20% مقدم وتقسيط حتى 6 سنوات",
      en: "20% down payment over 6 years",
    },
    delivery: { ar: "جاهز للاستلام", en: "Ready to move" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 6,
    tags: ["featured", "ready", "prime", "exclusive"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "حديقة خاصة", en: "Private garden" },
      { ar: "غرفة معيشة عائلية", en: "Family lounge" },
      { ar: "مطبخ واسع", en: "Large kitchen" },
      { ar: "تشغيل فوري", en: "Immediate handover" },
    ],
    nearby: [
      { ar: "مول العرب", en: "Mall of Arabia" },
      { ar: "المحور المركزي", en: "Central Axis" },
      { ar: "مدارس دولية", en: "International schools" },
    ],
    investmentAngle: {
      ar: "تخدم الباحثين عن فيلا جاهزة في الشيخ زايد مع سيولة إعادة بيع واستقرار سعري قوي.",
      en: "Built for buyers who need a ready villa in Sheikh Zayed with strong resale liquidity.",
    },
    coordinates: { lat: 30.0341, lng: 30.9786 },
  },
  {
    slug: "october-greens-townhouse",
    title: {
      ar: "تاون هاوس عائلي في 6 أكتوبر",
      en: "Family Townhouse in 6th of October",
    },
    summary: {
      ar: "تاون هاوس عملي في غرب القاهرة مناسب للسكن والاستثمار متوسط المدى.",
      en: "A practical West Cairo townhouse for both end users and medium-term investors.",
    },
    description: {
      ar: "وحدة داخل مجمع منخفض الكثافة مع خدمات عائلية وخيارات تنافسية مقارنة بالمناطق المجاورة في الشيخ زايد.",
      en: "A low-density gated townhouse opportunity with family-oriented services and a strong West Cairo value profile.",
    },
    locationSlug: "6th-of-october",
    locationName: { ar: "6 أكتوبر", en: "6th of October" },
    compound: { ar: "أكتوبر جرينز", en: "October Greens" },
    propertyType: "townhouse",
    price: 12500000,
    priceLabel: { ar: "12,500,000 جنيه", en: "EGP 12,500,000" },
    size: 245,
    bedrooms: 4,
    bathrooms: 4,
    finishing: { ar: "نصف تشطيب", en: "Semi-finished" },
    paymentPlan: {
      ar: "10% مقدم وتقسيط حتى 8 سنوات",
      en: "10% down payment over 8 years",
    },
    delivery: { ar: "2027", en: "2027" },
    deliveryYear: 2027,
    isReady: false,
    installmentYears: 8,
    tags: ["installments", "prime", "underMarket"],
    gallery: bayGallery,
    amenities: [
      { ar: "مجتمع منخفض الكثافة", en: "Low-density community" },
      { ar: "ممشى تجاري", en: "Retail promenade" },
      { ar: "نادي رياضي", en: "Sports club" },
      { ar: "خطة سداد مريحة", en: "Flexible plan" },
    ],
    nearby: [
      { ar: "طريق الواحات", en: "Al Wahat Road" },
      { ar: "جامعات خاصة", en: "Private universities" },
      { ar: "محور 26 يوليو", en: "26th of July Corridor" },
    ],
    investmentAngle: {
      ar: "فرصة جيدة للدخول إلى سوق غرب القاهرة بوحدة عائلية مناسبة.",
      en: "A strong entry point into West Cairo through a practical family home.",
    },
    coordinates: { lat: 29.9853, lng: 30.9502 },
  },
  {
    slug: "sokhna-seaview-chalet",
    title: {
      ar: "شاليه بإطلالة بحرية في العين السخنة",
      en: "Sea-View Chalet in Ain Sokhna",
    },
    summary: {
      ar: "شاليه مصيفي مناسب للعائلات والمستثمرين الباحثين عن سيولة إيجارية سريعة.",
      en: "A resort chalet for families and investors seeking fast rental turnover.",
    },
    description: {
      ar: "وحدة عملية في مشروع ساحلي قريب من القاهرة تجعلها خيارًا ممتازًا للاستخدام المتكرر أو الاستثمار قصير المدى.",
      en: "A coastal unit close to Cairo, ideal for frequent use, short vacations, and flexible summer investment.",
    },
    locationSlug: "ain-sokhna",
    locationName: { ar: "العين السخنة", en: "Ain Sokhna" },
    compound: { ar: "سوخنة سي فيو", en: "Sokhna Sea View" },
    propertyType: "chalet",
    price: 6400000,
    priceLabel: { ar: "6,400,000 جنيه", en: "EGP 6,400,000" },
    size: 132,
    bedrooms: 2,
    bathrooms: 2,
    finishing: { ar: "تشطيب كامل", en: "Fully finished" },
    paymentPlan: {
      ar: "5% مقدم وتقسيط حتى 7 سنوات",
      en: "5% down payment over 7 years",
    },
    delivery: { ar: "صيف 2026", en: "Summer 2026" },
    deliveryYear: 2026,
    isReady: false,
    installmentYears: 7,
    tags: ["underMarket", "installments", "bestDeal", "limited"],
    gallery: bayGallery,
    amenities: [
      { ar: "إطلالة بحرية", en: "Sea view" },
      { ar: "نادي شاطئي", en: "Beach club" },
      { ar: "تشغيل إيجاري محتمل", en: "Rental-ready potential" },
      { ar: "وصول سريع من القاهرة", en: "Quick access from Cairo" },
    ],
    nearby: [
      { ar: "الطريق الدائري الإقليمي", en: "Regional Ring Road" },
      { ar: "مراسي اليخوت", en: "Marina services" },
      { ar: "مناطق تجارية", en: "Retail and dining" },
    ],
    investmentAngle: {
      ar: "دخول ممتاز إلى سوق المصايف مع مخاطرة أقل وطلب موسمي قوي.",
      en: "An attractive entry-level summer property with resilient demand.",
    },
    coordinates: { lat: 29.4771, lng: 32.4745 },
  },
  {
    slug: "new-cairo-investment-twinhouse",
    title: {
      ar: "توين هاوس استثماري في القاهرة الجديدة",
      en: "Investment Twin House in New Cairo",
    },
    summary: {
      ar: "توين هاوس بموقع راقٍ داخل مجتمع متكامل مناسب للمستثمرين والعائلات.",
      en: "A premium twin house in New Cairo for investors and families.",
    },
    description: {
      ar: "الوحدة تستهدف المشترين الباحثين عن منتج منخفض المعروض نسبيًا في التجمع مع إمكانات نمو رأسمالي قوية خلال الأعوام المقبلة.",
      en: "Targeted at buyers seeking a relatively scarce East Cairo product with meaningful capital appreciation potential.",
    },
    locationSlug: "new-cairo",
    locationName: { ar: "القاهرة الجديدة", en: "New Cairo" },
    compound: { ar: "إيست كراون", en: "East Crown" },
    propertyType: "twinhouse",
    price: 18900000,
    priceLabel: { ar: "18,900,000 جنيه", en: "EGP 18,900,000" },
    size: 280,
    bedrooms: 4,
    bathrooms: 4,
    finishing: { ar: "نصف تشطيب فاخر", en: "Premium semi-finished" },
    paymentPlan: {
      ar: "15% مقدم وتقسيط حتى 8 سنوات",
      en: "15% down payment over 8 years",
    },
    delivery: { ar: "2027", en: "2027" },
    deliveryYear: 2027,
    isReady: false,
    installmentYears: 8,
    tags: ["featured", "underMarket", "installments", "prime"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "واجهة عريضة", en: "Wide facade" },
      { ar: "حديقة خاصة", en: "Private garden" },
      { ar: "مجتمع متكامل", en: "Integrated community" },
      { ar: "قرب الخدمات التعليمية", en: "Near education hubs" },
    ],
    nearby: [
      { ar: "الجامعة الأمريكية", en: "AUC" },
      { ar: "شارع التسعين", en: "90 Street" },
      { ar: "مناطق أعمال شرق القاهرة", en: "East Cairo business hubs" },
    ],
    investmentAngle: {
      ar: "يخاطب المستثمرين الذين يستهدفون مخزون محدود في القاهرة الجديدة مع هامش نمو جيد.",
      en: "Appeals to investors targeting constrained New Cairo inventory with high upgrade demand.",
    },
    coordinates: { lat: 30.0112, lng: 31.4696 },
  },
  {
    slug: "new-capital-ready-apartment",
    title: {
      ar: "شقة جاهزة للاستلام في العاصمة الإدارية بموقع حيوي",
      en: "Ready Apartment in the New Capital",
    },
    summary: {
      ar: "شقة جاهزة بتشطيب أنيق في منطقة مخدومة داخل العاصمة الإدارية.",
      en: "A ready-to-move apartment in a serviced New Capital district.",
    },
    description: {
      ar: "وحدة مناسبة للشراء السريع أو لتسكين الموظفين التنفيذيين مع قربها من المناطق الحكومية والمالية.",
      en: "An efficient purchase option for immediate occupancy or executive housing close to the Capital's key districts.",
    },
    locationSlug: "new-capital",
    locationName: { ar: "العاصمة الإدارية", en: "New Capital" },
    compound: { ar: "هايتس ديستريكت", en: "Heights District" },
    propertyType: "apartment",
    price: 9100000,
    priceLabel: { ar: "9,100,000 جنيه", en: "EGP 9,100,000" },
    size: 160,
    bedrooms: 3,
    bathrooms: 3,
    finishing: { ar: "تشطيب كامل", en: "Fully finished" },
    paymentPlan: {
      ar: "25% مقدم وتقسيط حتى 5 سنوات",
      en: "25% down payment over 5 years",
    },
    delivery: { ar: "جاهز للاستلام", en: "Ready to move" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 5,
    tags: ["ready", "featured", "prime"],
    gallery: bayGallery,
    amenities: [
      { ar: "إدارة ذكية للمبنى", en: "Smart building management" },
      { ar: "منطقة تجارية", en: "Retail zone" },
      { ar: "مدخل فندقي", en: "Hotel-style entrance" },
      { ar: "استلام فوري", en: "Immediate handover" },
    ],
    nearby: [
      { ar: "الحي الحكومي", en: "Government district" },
      { ar: "الحي المالي", en: "Financial district" },
      { ar: "المنطقة المركزية", en: "Central district" },
    ],
    investmentAngle: {
      ar: "يناسب المستثمرين الذين يفضلون وحدات جاهزة في سوق ناشئ عالي النمو.",
      en: "Fits buyers who prefer ready inventory inside a high-growth emerging market.",
    },
    coordinates: { lat: 30.0019, lng: 31.7419 },
  },
];

export const properties: Property[] = [
  {
    slug: "hacienda-bay-villa-rent-6br-3m",
    title: {
      ar: "فيلا للإيجار في هاسيندا باي - الساحل الشمالي",
      en: "Villa for rent at Hacienda Bay North coast",
    },
    summary: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥",
    },
    description: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥 🏖️ فيلا للإيجار في هاسيندا باي - الساحل الشمالي 🏖️ أرضي وأول 🏖️ مناطق معيشة 🏖️ ريسبشن 🏖️ مطبخ 🏖️ 6 غرف نوم (3 ماستر) 🏖️ 5 حمامات 🏖️ غرفة مربية بحمام 🏖️ تكييفات 🏖️ موقف سيارة 🏖️ 30,000 لليلة",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥 🏖️ Villa for rent at Hacienda Bay North coast 🏖️ ground and first floor 🏖️ living areas 🏖️ Reception... 🏖️ Kitchen 🏖️ Bedrooms 6 ( 3 masters) 🏖️ Bathrooms 5 🏖️ nanny room with bahtroom 🏖️ A/C 🏖️ slot parking 🏖️ 30,000 per night",
    },
    locationSlug: "north-coast",
    locationName: { ar: "الساحل الشمالي", en: "North Coast" },
    compound: { ar: "هاسيندا باي", en: "Hacienda Bay" },
    propertyType: "villa",
    price: 30000,
    priceLabel: { ar: "30,000 لليلة", en: "30,000 per night" },
    size: 0,
    bedrooms: 6,
    bathrooms: 5,
    finishing: { ar: "تكييفات", en: "A/C" },
    paymentPlan: {
      ar: "إيجار يومي (لليلة)",
      en: "For rent per night",
    },
    delivery: { ar: "احجز الآن - صيف 2026", en: "Book now - summer 2026" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 0,
    tags: ["featured", "ready", "prime"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "أرضي وأول", en: "ground and first floor" },
      { ar: "مناطق معيشة", en: "living areas" },
      { ar: "ريسبشن", en: "Reception..." },
      { ar: "مطبخ", en: "Kitchen" },
      { ar: "6 غرف نوم (3 ماستر)", en: "Bedrooms 6 ( 3 masters)" },
      { ar: "5 حمامات", en: "Bathrooms 5" },
      { ar: "غرفة مربية بحمام", en: "nanny room with bahtroom" },
      { ar: "تكييفات", en: "A/C" },
      { ar: "موقف سيارة", en: "slot parking" },
    ],
    nearby: [],
    investmentAngle: {
      ar: "تواصل معنا لمعرفة التفاصيل الكاملة والوحدات المتاحة المشابهة.",
      en: "Contact us for full details and similar available units.",
    },
    coordinates: { lat: 30.9824, lng: 28.7324 },
  },
  {
    slug: "hacienda-bay-villa-rent-6br-2m",
    title: {
      ar: "فيلا للإيجار في هاسيندا باي - الساحل الشمالي",
      en: "Villa for rent at Hacienda Bay North coast",
    },
    summary: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥",
    },
    description: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥 🏖️ فيلا للإيجار في هاسيندا باي - الساحل الشمالي 🏖️ أرضي وأول 🏖️ مناطق معيشة 🏖️ ريسبشن 🏖️ مطبخ 🏖️ 6 غرف نوم (2 ماستر) 🏖️ 5 حمامات 🏖️ غرفة مربية بحمام 🏖️ تكييفات 🏖️ موقف سيارة 🏖️ 30,000 لليلة",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥 🏖️ Villa for rent at Hacienda Bay North coast 🏖️ ground and first floor 🏖️ living areas 🏖️ Reception... 🏖️ Kitchen 🏖️ Bedrooms 6 ( 2 masters) 🏖️ Bathrooms 5 🏖️ nanny room with bahtroom 🏖️ A/C 🏖️ slot parking 🏖️ 30,000 per night",
    },
    locationSlug: "north-coast",
    locationName: { ar: "الساحل الشمالي", en: "North Coast" },
    compound: { ar: "هاسيندا باي", en: "Hacienda Bay" },
    propertyType: "villa",
    price: 30000,
    priceLabel: { ar: "30,000 لليلة", en: "30,000 per night" },
    size: 0,
    bedrooms: 6,
    bathrooms: 5,
    finishing: { ar: "تكييفات", en: "A/C" },
    paymentPlan: {
      ar: "إيجار يومي (لليلة)",
      en: "For rent per night",
    },
    delivery: { ar: "احجز الآن - صيف 2026", en: "Book now - summer 2026" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 0,
    tags: ["featured", "ready", "prime"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "أرضي وأول", en: "ground and first floor" },
      { ar: "مناطق معيشة", en: "living areas" },
      { ar: "ريسبشن", en: "Reception..." },
      { ar: "مطبخ", en: "Kitchen" },
      { ar: "6 غرف نوم (2 ماستر)", en: "Bedrooms 6 ( 2 masters)" },
      { ar: "5 حمامات", en: "Bathrooms 5" },
      { ar: "غرفة مربية بحمام", en: "nanny room with bahtroom" },
      { ar: "تكييفات", en: "A/C" },
      { ar: "موقف سيارة", en: "slot parking" },
    ],
    nearby: [],
    investmentAngle: {
      ar: "تواصل معنا لمعرفة التفاصيل الكاملة والوحدات المتاحة المشابهة.",
      en: "Contact us for full details and similar available units.",
    },
    coordinates: { lat: 30.9824, lng: 28.7324 },
  },
  {
    slug: "hacienda-bay-villa-rent-5br-5m",
    title: {
      ar: "فيلا للإيجار في هاسيندا باي - الساحل الشمالي",
      en: "Villa for rent at Hacienda Bay North coast",
    },
    summary: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥",
    },
    description: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥 🏖️ فيلا للإيجار في هاسيندا باي - الساحل الشمالي 🏖️ أرضي وأول 🏖️ مناطق معيشة 🏖️ ريسبشن 🏖️ مطبخ 🏖️ 5 غرف نوم (5 ماستر) 🏖️ 6 حمامات 🏖️ غرفة سائق بحمام 🏖️ غرفة مربية بحمام 🏖️ تكييفات 🏖️ موقف سيارة 🏖️ 30,000 لليلة",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥 🏖️ Villa for rent at Hacienda Bay North coast 🏖️ ground and first floor 🏖️ living areas 🏖️ Reception... 🏖️ Kitchen 🏖️ Bedrooms 5 ( 5 masters) 🏖️ Bathrooms 6 🏖️ Driver room with bathroom 🏖️ nanny room with bahtroom 🏖️ A/C 🏖️ slot parking 🏖️ 30,000 per night",
    },
    locationSlug: "north-coast",
    locationName: { ar: "الساحل الشمالي", en: "North Coast" },
    compound: { ar: "هاسيندا باي", en: "Hacienda Bay" },
    propertyType: "villa",
    price: 30000,
    priceLabel: { ar: "30,000 لليلة", en: "30,000 per night" },
    size: 0,
    bedrooms: 5,
    bathrooms: 6,
    finishing: { ar: "تكييفات", en: "A/C" },
    paymentPlan: {
      ar: "إيجار يومي (لليلة)",
      en: "For rent per night",
    },
    delivery: { ar: "احجز الآن - صيف 2026", en: "Book now - summer 2026" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 0,
    tags: ["featured", "ready", "prime", "limited"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "أرضي وأول", en: "ground and first floor" },
      { ar: "مناطق معيشة", en: "living areas" },
      { ar: "ريسبشن", en: "Reception..." },
      { ar: "مطبخ", en: "Kitchen" },
      { ar: "5 غرف نوم (5 ماستر)", en: "Bedrooms 5 ( 5 masters)" },
      { ar: "6 حمامات", en: "Bathrooms 6" },
      { ar: "غرفة سائق بحمام", en: "Driver room with bathroom" },
      { ar: "غرفة مربية بحمام", en: "nanny room with bahtroom" },
      { ar: "تكييفات", en: "A/C" },
      { ar: "موقف سيارة", en: "slot parking" },
    ],
    nearby: [],
    investmentAngle: {
      ar: "تواصل معنا لمعرفة التفاصيل الكاملة والوحدات المتاحة المشابهة.",
      en: "Contact us for full details and similar available units.",
    },
    coordinates: { lat: 30.9824, lng: 28.7324 },
  },
  {
    slug: "hacienda-bay-chalet-rent-3br-2m",
    title: {
      ar: "شاليه للإيجار في هاسيندا باي - الساحل الشمالي",
      en: "Chalet for rent at Hacienda Bay North coast",
    },
    summary: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥",
    },
    description: {
      ar: "🔥احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥 🏖️ شاليه للإيجار في هاسيندا باي - الساحل الشمالي 🏖️ واجهة بحرية/موقع مميز 🏖️ دور أول مع روف 🏖️ ريسبشن 🏖️ مطبخ 🏖️ 3 غرف نوم (2 ماستر) 🏖️ ليفينج روم 🏖️ 4 حمامات 🏖️ غرفة سائق بحمام 🏖️ 2 موقف سيارة 🏖️ تكييفات 🏖️ 18.000 لليلة",
      en: "🔥Book now Dear valued customers, welcome summer 🏊 2026 🔥 🏖️ Chalet for rent at Hacienda Bay North coast 🏖️ Facing North/Prime location 🏖️ First floor with Roof 🏖️ Reception... 🏖️ Kitchen 🏖️ Bedrooms 3 ( 2 masters) 🏖️ Living Room 🏖️ Bathrooms 4 🏖️ Driver room with bahtroom 🏖️ slot parking 2 🏖️ A/C 🏖️ 18.000 per night",
    },
    locationSlug: "north-coast",
    locationName: { ar: "الساحل الشمالي", en: "North Coast" },
    compound: { ar: "هاسيندا باي", en: "Hacienda Bay" },
    propertyType: "chalet",
    price: 18000,
    priceLabel: { ar: "18.000 لليلة", en: "18.000 per night" },
    size: 0,
    bedrooms: 3,
    bathrooms: 4,
    finishing: { ar: "تكييفات", en: "A/C" },
    paymentPlan: {
      ar: "إيجار يومي (لليلة)",
      en: "For rent per night",
    },
    delivery: { ar: "احجز الآن - صيف 2026", en: "Book now - summer 2026" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 0,
    tags: ["featured", "ready", "prime", "bestDeal"],
    gallery: bayGallery,
    amenities: [
      { ar: "واجهة بحرية/موقع مميز", en: "Facing North/Prime location" },
      { ar: "دور أول مع روف", en: "First floor with Roof" },
      { ar: "ريسبشن", en: "Reception..." },
      { ar: "مطبخ", en: "Kitchen" },
      { ar: "3 غرف نوم (2 ماستر)", en: "Bedrooms 3 ( 2 masters)" },
      { ar: "ليفينج روم", en: "Living Room" },
      { ar: "4 حمامات", en: "Bathrooms 4" },
      { ar: "غرفة سائق بحمام", en: "Driver room with bahtroom" },
      { ar: "2 موقف سيارة", en: "slot parking 2" },
      { ar: "تكييفات", en: "A/C" },
    ],
    nearby: [],
    investmentAngle: {
      ar: "تواصل معنا لمعرفة التفاصيل الكاملة والوحدات المتاحة المشابهة.",
      en: "Contact us for full details and similar available units.",
    },
    coordinates: { lat: 30.9824, lng: 28.7324 },
  },
  {
    slug: "hacienda-bay-villa-rent-5br-3m-private-pool",
    title: {
      ar: "فيلا للإيجار في هاسيندا باي - الساحل الشمالي",
      en: "Villa for rent at Hacienda Bay North coast",
    },
    summary: {
      ar: "احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥",
      en: "Book now Dear valued customers, welcome summer 🏊 2026 🔥",
    },
    description: {
      ar: "احجز الآن عملاءنا الكرام، أهلاً بصيف 2026 🏊🔥 🏖️ فيلا للإيجار في هاسيندا باي - الساحل الشمالي 🏖️ أرضي وأول 🏖️ حمام سباحة خاص 🏊 🏖️ جاكوزي 🏖️ مناطق معيشة 🏖️ ريسبشن 🏖️ مطبخ 🏖️ 5 غرف نوم (3 ماستر) 🏖️ 5 حمامات 🏖️ غرفة مربية بحمام 🏖️ تكييفات 🏖️ موقف سيارة 🏖️ 35.000 لليلة",
      en: "Book now Dear valued customers, welcome summer 🏊 2026 🔥 🏖️ Villa for rent at Hacienda Bay North coast 🏖️ ground and first floor 🏖️ Private swimming pool🏊 🏖️ Jacuzzi... 🏖️ living areas 🏖️ Reception 🏖️ Kitchen 🏖️ Bedrooms 5 ( 3 masters) 🏖️ Bathrooms 5 🏖️ nanny room with bahtroom 🏖️ A/C 🏖️ slot parking 🏖️ 35.000 per night",
    },
    locationSlug: "north-coast",
    locationName: { ar: "الساحل الشمالي", en: "North Coast" },
    compound: { ar: "هاسيندا باي", en: "Hacienda Bay" },
    propertyType: "villa",
    price: 35000,
    priceLabel: { ar: "35.000 لليلة", en: "35.000 per night" },
    size: 0,
    bedrooms: 5,
    bathrooms: 5,
    finishing: { ar: "تكييفات", en: "A/C" },
    paymentPlan: {
      ar: "إيجار يومي (لليلة)",
      en: "For rent per night",
    },
    delivery: { ar: "احجز الآن - صيف 2026", en: "Book now - summer 2026" },
    deliveryYear: 2026,
    isReady: true,
    installmentYears: 0,
    tags: ["featured", "ready", "prime", "exclusive"],
    gallery: lagoonGallery,
    amenities: [
      { ar: "أرضي وأول", en: "ground and first floor" },
      { ar: "حمام سباحة خاص🏊", en: "Private swimming pool🏊" },
      { ar: "جاكوزي", en: "Jacuzzi..." },
      { ar: "مناطق معيشة", en: "living areas" },
      { ar: "ريسبشن", en: "Reception" },
      { ar: "مطبخ", en: "Kitchen" },
      { ar: "5 غرف نوم (3 ماستر)", en: "Bedrooms 5 ( 3 masters)" },
      { ar: "5 حمامات", en: "Bathrooms 5" },
      { ar: "غرفة مربية بحمام", en: "nanny room with bahtroom" },
      { ar: "تكييفات", en: "A/C" },
      { ar: "موقف سيارة", en: "slot parking" },
    ],
    nearby: [],
    investmentAngle: {
      ar: "تواصل معنا لمعرفة التفاصيل الكاملة والوحدات المتاحة المشابهة.",
      en: "Contact us for full details and similar available units.",
    },
    coordinates: { lat: 30.9824, lng: 28.7324 },
  },
];

export const categories = [
  {
    slug: "apartments",
    label: { ar: "شقق", en: "Apartments" },
    description: {
      ar: "وحدات سكنية مناسبة للعائلات والمستثمرين داخل أفضل المجتمعات الجديدة.",
      en: "Residential units for families and investors across Egypt's top communities.",
    },
    types: ["apartment"] as PropertyType[],
    stat: { ar: "85+ وحدة نشطة", en: "85+ active units" },
  },
  {
    slug: "villas",
    label: { ar: "فيلات", en: "Villas" },
    description: {
      ar: "فيلات مستقلة في مواقع راقية لعشاق الخصوصية والسكن الفاخر.",
      en: "Standalone villas in prestigious compounds for private upscale living.",
    },
    types: ["villa"] as PropertyType[],
    stat: { ar: "40+ فرصة مميزة", en: "40+ curated opportunities" },
  },
  {
    slug: "chalets",
    label: { ar: "شاليهات", en: "Chalets" },
    description: {
      ar: "شاليهات مصيفية مختارة في أقوى وجهات الساحل والسخنة.",
      en: "Summer chalets in the strongest North Coast and Sokhna destinations.",
    },
    types: ["chalet"] as PropertyType[],
    stat: { ar: "60+ مصيف استثماري", en: "60+ summer opportunities" },
  },
  {
    slug: "penthouses",
    label: { ar: "بنتهاوس", en: "Penthouses" },
    description: {
      ar: "منتجات نادرة لعملاء المساحات المفتوحة والإطلالات المميزة.",
      en: "Rare products for buyers seeking panoramic terraces and elevated living.",
    },
    types: ["penthouse"] as PropertyType[],
    stat: { ar: "منتجات محدودة", en: "Limited premium stock" },
  },
  {
    slug: "townhomes",
    label: { ar: "توين هاوس / تاون هاوس", en: "Twin Houses / Townhouses" },
    description: {
      ar: "حلول متوازنة بين الاستقلالية وجودة المساحة ضمن مجتمعات متكاملة.",
      en: "Balanced homes offering privacy, community, and stronger value efficiency.",
    },
    types: ["townhouse", "twinhouse"] as PropertyType[],
    stat: { ar: "أفضل توازن في الفئة", en: "Well-balanced segment" },
  },
];

export const locations: LocationGuide[] = [
  {
    slug: "new-cairo",
    name: { ar: "القاهرة الجديدة", en: "New Cairo" },
    heroTitle: {
      ar: "القاهرة الجديدة: السوق الأكثر طلبًا في شرق القاهرة",
      en: "New Cairo: East Cairo's strongest demand hub",
    },
    heroDescription: {
      ar: "مزيج بين السكن الراقي، التعليم الدولي، والفرص الاستثمارية الطويلة الأجل.",
      en: "A blend of upscale living, international education, and long-term investment depth.",
    },
    overview: {
      ar: "القاهرة الجديدة تعد من أهم مناطق السكن والاستثمار في مصر بفضل البنية التحتية الحديثة، المشاريع المتنوعة، والطلب المستمر من الأسر والمغتربين.",
      en: "New Cairo remains one of Egypt's most mature residential and investment markets thanks to modern infrastructure, broad product mix, and sustained family demand.",
    },
    whyInvest: [
      {
        ar: "طلب قوي من المشترين والمستأجرين في التجمع الخامس والمناطق المحيطة.",
        en: "Consistent buyer and tenant demand across Fifth Settlement and surrounding districts.",
      },
      {
        ar: "قرب المدارس الدولية والجامعات والمراكز التجارية.",
        en: "Close to top schools, universities, and retail destinations.",
      },
      {
        ar: "تنوع واسع في المنتجات بين الشقق، التوين هاوس، والفيلات.",
        en: "Broad range of inventory including apartments, twin houses, and villas.",
      },
    ],
    propertyTypes: ["apartment", "twinhouse"],
    featuredPropertySlugs: [
      "new-cairo-skyline-apartment",
      "new-cairo-investment-twinhouse",
    ],
    highlights: [
      {
        label: { ar: "اتجاه السوق", en: "Market momentum" },
        value: { ar: "طلب سكني واستثماري مرتفع", en: "High residential and investment demand" },
      },
      {
        label: { ar: "أبرز المشترين", en: "Top buyer profile" },
        value: { ar: "عائلات ومغتربون ومستثمرون", en: "Families, expats, and investors" },
      },
      {
        label: { ar: "مرونة الاختيار", en: "Selection flexibility" },
        value: { ar: "خيارات متنوعة للمساحات", en: "Multiple size and layout options" },
      },
    ],
    image: bayGallery[0],
  },
  {
    slug: "new-capital",
    name: { ar: "العاصمة الإدارية", en: "New Capital" },
    heroTitle: {
      ar: "العاصمة الإدارية: مدينة الأعمال والاستثمار القادم",
      en: "New Capital: Egypt's next business and growth city",
    },
    heroDescription: {
      ar: "وجهة قوية للمستثمرين الباحثين عن مخزون جديد وخطط سداد طويلة.",
      en: "A strong destination for investors seeking new inventory and long-horizon growth.",
    },
    overview: {
      ar: "تجمع العاصمة الإدارية بين المشروعات الحكومية، المناطق المالية، والمجتمعات الذكية الحديثة، ما يجعلها سوقًا استثماريًا متسارعًا.",
      en: "The New Capital combines government, finance, and smart urban communities, creating one of Egypt's most compelling long-horizon property markets.",
    },
    whyInvest: [
      {
        ar: "مخزون حديث مع معايير بناء وتشغيل جديدة.",
        en: "New supply built around updated planning and infrastructure standards.",
      },
      {
        ar: "تنوع كبير في المنتجات يناسب المستثمرين الباحثين عن مرونة أعلى في الاختيار.",
        en: "A broad inventory mix suited for investors looking for greater selection flexibility.",
      },
      {
        ar: "منتجات متنوعة بين الشقق والبنتهاوس والوحدات الجاهزة.",
        en: "Diverse inventory spanning apartments, penthouses, and ready units.",
      },
    ],
    propertyTypes: ["apartment", "penthouse"],
    featuredPropertySlugs: [
      "capital-view-penthouse",
      "new-capital-ready-apartment",
    ],
    highlights: [
      {
        label: { ar: "أفق النمو", en: "Growth horizon" },
        value: { ar: "مرتفع على المدى المتوسط", en: "High medium-term upside" },
      },
      {
        label: { ar: "نوع الطلب", en: "Demand profile" },
        value: { ar: "إداري وسكني وتنفيذي", en: "Executive, administrative, residential" },
      },
      {
        label: { ar: "تنوع المنتجات", en: "Inventory mix" },
        value: { ar: "شقق، بنتهاوس، ووحدات مميزة", en: "Apartments, penthouses, and premium units" },
      },
    ],
    image: lagoonGallery[1],
  },
  {
    slug: "sheikh-zayed",
    name: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    heroTitle: {
      ar: "الشيخ زايد: عنوان السكن الراقي في غرب القاهرة",
      en: "Sheikh Zayed: premium family living in West Cairo",
    },
    heroDescription: {
      ar: "سوق ثابت وقوي يجذب الأسر الباحثة عن جودة حياة مرتفعة.",
      en: "A resilient family market known for quality of life and premium gated living.",
    },
    overview: {
      ar: "الشيخ زايد من أكثر الأسواق استقرارًا في غرب القاهرة، بفضل قربها من المدارس الدولية والمولات والطرق الرئيسية.",
      en: "Sheikh Zayed is one of West Cairo's most stable and sought-after family markets with strong infrastructure and a premium lifestyle profile.",
    },
    whyInvest: [
      {
        ar: "استقرار سعري وقوة في إعادة البيع.",
        en: "Pricing resilience and strong resale liquidity.",
      },
      {
        ar: "طلب سكني عائلي مستمر.",
        en: "Steady family end-user demand.",
      },
      {
        ar: "قربها من الشيخ زايد الجديدة ومحاور غرب القاهرة.",
        en: "Strategic access to new expansion zones and major corridors.",
      },
    ],
    propertyTypes: ["villa"],
    featuredPropertySlugs: ["zayed-signature-villa"],
    highlights: [
      {
        label: { ar: "نوع المنتج", en: "Core inventory" },
        value: { ar: "فيلات وبيوت عائلية", en: "Villas and family homes" },
      },
      {
        label: { ar: "السيولة", en: "Liquidity" },
        value: { ar: "مرتفعة", en: "High" },
      },
      {
        label: { ar: "جمهور الشراء", en: "Buyer base" },
        value: { ar: "عائلات وعملاء تغيير السكن", en: "Families and upgraders" },
      },
    ],
    image: lagoonGallery[2],
  },
  {
    slug: "6th-of-october",
    name: { ar: "6 أكتوبر", en: "6th of October" },
    heroTitle: {
      ar: "6 أكتوبر: قيمة تنافسية في غرب القاهرة",
      en: "6th of October: competitive value in West Cairo",
    },
    heroDescription: {
      ar: "وجهة مناسبة للمشترين الباحثين عن مساحة أكبر وخيارات سكنية أوسع.",
      en: "A practical market for buyers seeking larger homes and stronger affordability.",
    },
    overview: {
      ar: "تجمع مدينة 6 أكتوبر بين المجتمعات السكنية والمشروعات التعليمية والطبية، ما يجعلها سوقًا متوازنًا للسكن والاستثمار.",
      en: "6th of October combines residential, educational, and medical destinations, creating a balanced live-invest market.",
    },
    whyInvest: [
      {
        ar: "خيارات أكثر تنافسية مقارنة ببعض مناطق غرب القاهرة.",
        en: "More competitive options than some neighboring West Cairo zones.",
      },
      {
        ar: "خيارات متنوعة للشقق والتاون هاوس.",
        en: "Wide inventory mix across apartments and townhouses.",
      },
      {
        ar: "إمكانات نمو مع توسع المحاور والأنشطة التجارية.",
        en: "Upside potential as infrastructure and commercial activity expand.",
      },
    ],
    propertyTypes: ["townhouse"],
    featuredPropertySlugs: ["october-greens-townhouse"],
    highlights: [
      {
        label: { ar: "القيمة", en: "Value proposition" },
        value: { ar: "مساحات أكبر ضمن نفس الفئة", en: "More space within the same segment" },
      },
      {
        label: { ar: "تنوع المنتجات", en: "Inventory variety" },
        value: { ar: "بدائل متعددة للمساحات", en: "Multiple size options" },
      },
      {
        label: { ar: "الجمهور", en: "Target buyers" },
        value: { ar: "أسر ومشترون لأول مرة", en: "Families and first upgraders" },
      },
    ],
    image: bayGallery[1],
  },
  {
    slug: "north-coast",
    name: { ar: "الساحل الشمالي", en: "North Coast" },
    heroTitle: {
      ar: "الساحل الشمالي: المصيف الاستثماري الأعلى طلبًا",
      en: "North Coast: Egypt's premier summer investment market",
    },
    heroDescription: {
      ar: "طلب قوي على الشاليهات والفيلات الفاخرة وعوائد موسمية مرتفعة.",
      en: "High demand for luxury villas and chalets with premium seasonal yields.",
    },
    overview: {
      ar: "الساحل الشمالي أحد أهم أسواق العقار الموسمي في مصر، ويتمتع بقوة تسويقية كبيرة خاصة داخل المنتجعات الراقية.",
      en: "The North Coast is Egypt's leading seasonal property market with powerful branding, premium resort supply, and strong summer monetization.",
    },
    whyInvest: [
      {
        ar: "إمكانات إيجارية موسمية مرتفعة في المشروعات المعروفة.",
        en: "High seasonal rental potential in well-known branded resorts.",
      },
      {
        ar: "جمهور شراء قوي من العملاء المحليين والمغتربين.",
        en: "Strong local and expat buyer appetite.",
      },
      {
        ar: "ارتفاع الطلب على إعادة البيع في بعض المنتجعات المحدودة المعروض.",
        en: "Strong resale demand in supply-constrained premium resorts.",
      },
    ],
    propertyTypes: ["villa", "chalet"],
    featuredPropertySlugs: [
      "lagoon-villa-hacienda-bay",
      "bay-chalet-hacienda-bay",
    ],
    highlights: [
      {
        label: { ar: "العائد الموسمي", en: "Seasonal yield" },
        value: { ar: "مرتفع", en: "High" },
      },
      {
        label: { ar: "الطلب", en: "Demand" },
        value: { ar: "فاخر ومصيفي", en: "Luxury summer demand" },
      },
      {
        label: { ar: "نوع الفرص", en: "Opportunity type" },
        value: { ar: "إعادة بيع + وحدات جاهزة", en: "Resale + ready inventory" },
      },
    ],
    image: lagoonGallery[0],
  },
  {
    slug: "ain-sokhna",
    name: { ar: "العين السخنة", en: "Ain Sokhna" },
    heroTitle: {
      ar: "العين السخنة: مصيف قريب بعائد مرن",
      en: "Ain Sokhna: close-to-Cairo summer demand",
    },
    heroDescription: {
      ar: "وجهة مناسبة للمصيف المتكرر والاستثمار قصير ومتوسط المدى.",
      en: "A convenient coastal market for repeat personal use and flexible summer investment.",
    },
    overview: {
      ar: "العين السخنة تتميز بقربها من القاهرة، ما يجعلها خيارًا عمليًا للمصيف السريع والاستثمار الإيجاري قصير المدى.",
      en: "Ain Sokhna benefits from close proximity to Cairo, making it a highly practical market for weekend usage and short-stay rental demand.",
    },
    whyInvest: [
      {
        ar: "سهولة الوصول من القاهرة تقلل فترات الشغور.",
        en: "Proximity to Cairo helps reduce vacancy and boost repeat use.",
      },
      {
        ar: "أسعار دخول أقل مقارنة ببعض مشاريع الساحل الشمالي.",
        en: "Lower entry pricing than many North Coast alternatives.",
      },
      {
        ar: "طلب جيد على الوحدات الصغيرة والمتوسطة.",
        en: "Good demand for small to medium-sized summer units.",
      },
    ],
    propertyTypes: ["chalet"],
    featuredPropertySlugs: ["sokhna-seaview-chalet"],
    highlights: [
      {
        label: { ar: "القرب من القاهرة", en: "Distance to Cairo" },
        value: { ar: "مثالي للويك إند", en: "Ideal for weekend demand" },
      },
      {
        label: { ar: "أسعار الدخول", en: "Entry pricing" },
        value: { ar: "أقل نسبيًا", en: "Relatively accessible" },
      },
      {
        label: { ar: "أفضلية السوق", en: "Market edge" },
        value: { ar: "سيولة سريعة", en: "Fast summer liquidity" },
      },
    ],
    image: bayGallery[2],
  },
];

export const trustPoints = [
  {
    title: { ar: "استشارات مبنية على السوق", en: "Market-led advisory" },
    description: {
      ar: "نرشد العميل وفقًا لقراءة حقيقية للسوق، وليس فقط للوحدة المتاحة.",
      en: "We advise from real market insight, not from whatever listing happens to be available.",
    },
  },
  {
    title: { ar: "عروض مختارة بعناية", en: "Curated premium inventory" },
    description: {
      ar: "نركز على الوحدات التي تحمل ميزة واضحة: موقع قوي، جودة مشروع، أو ندرة في المعروض.",
      en: "We focus on units with a clear edge: location strength, project quality, or constrained supply.",
    },
  },
  {
    title: { ar: "شفافية وتفاوض ذكي", en: "Transparent negotiation" },
    description: {
      ar: "نوضح نقاط القوة والمخاطر، ونتفاوض لصالح العميل للحصول على أفضل قيمة.",
      en: "We highlight the upside and the risk, then negotiate to secure stronger value.",
    },
  },
  {
    title: { ar: "متابعة حتى الإغلاق", en: "Lead handling to closure" },
    description: {
      ar: "من أول استفسار حتى المعاينة والحجز، نوفر دعماً سريعًا وواضحًا.",
      en: "From the first inquiry to viewing and booking, we provide fast, direct support.",
    },
  },
];

export const testimonials = [
  {
    name: { ar: "مها شريف", en: "Maha Sherif" },
    title: { ar: "مستثمرة مقيمة بالخارج", en: "Egyptian investor abroad" },
    quote: {
      ar: "فريق إيمدج ساعدني أختار فرصة أفضل من الوحدات التي كنت أراجعها وحدي، والأهم أنهم شرحوا لي فروق القيمة بين كل مشروع بوضوح.",
      en: "Image Investments helped me shortlist a better opportunity than the units I was reviewing on my own, and they clearly explained the value differences between projects.",
    },
  },
  {
    name: { ar: "أحمد زكي", en: "Ahmed Zaki" },
    title: { ar: "مشتري سكني", en: "End-user buyer" },
    quote: {
      ar: "التواصل كان سريعًا جدًا، والعرض كان منظمًا، وتم توجيهي لوحدة جاهزة للاستلام تناسب ميزانيتي فعلًا.",
      en: "The communication was fast, the options were well-structured, and I was guided toward a ready unit that actually matched my budget.",
    },
  },
  {
    name: { ar: "دينا عاطف", en: "Dina Atef" },
    title: { ar: "مستثمرة في الساحل", en: "North Coast investor" },
    quote: {
      ar: "أكثر ما أعجبني هو الصراحة في تقييم الفرص وعدم الضغط للبيع. هذا أعطاني ثقة كبيرة في القرار.",
      en: "What stood out most was the honesty in evaluating opportunities without pushing a sale. That gave me real confidence in the decision.",
    },
  },
];

export const faqs = [
  {
    question: {
      ar: "هل توفرون أنواعًا مختلفة من العقارات بحسب الهدف؟",
      en: "Do you offer different property options based on buyer goals?",
    },
    answer: {
      ar: "نعم، نوفر خيارات متنوعة للسكن والاستثمار والمصيف، ويتم الترشيح وفق المنطقة ونوع العقار وأولوية العميل.",
      en: "Yes. We cover home purchase, investment, and seasonal options, then shortlist based on location, property type, and client priority.",
    },
  },
  {
    question: {
      ar: "هل تساعدون في ترشيح الفرص الاستثمارية فقط أم السكن أيضًا؟",
      en: "Do you advise on investment only, or also on home purchases?",
    },
    answer: {
      ar: "نخدم المستثمرين والمشترين للسكن معًا، ونبني الترشيحات بناءً على الهدف، الميزانية، وأفق العائد أو الاستخدام.",
      en: "We support both investors and end users, tailoring recommendations around goals, budget, and expected use or return.",
    },
  },
  {
    question: {
      ar: "هل يوجد دعم للمصريين المقيمين بالخارج؟",
      en: "Do you support Egyptians living abroad?",
    },
    answer: {
      ar: "نعم، لدينا أسلوب عرض واستشارة مناسب للعملاء خارج مصر مع ترتيب المعاينات، المقارنات، والمتابعة عن بُعد.",
      en: "Yes. We work with Egyptians abroad through structured comparisons, remote follow-ups, and advisor-led shortlisting.",
    },
  },
  {
    question: {
      ar: "هل يمكن طلب أفضل العروض الأقل من سعر السوق؟",
      en: "Can I request under-market opportunities specifically?",
    },
    answer: {
      ar: "بالتأكيد، ويمكننا إرسال العروض الأنسب بناءً على المنطقة، نوع العقار، والميزانية المستهدفة.",
      en: "Absolutely. We can share the best options based on your target location, property type, and budget.",
    },
  },
  {
    question: {
      ar: "كيف يتم التواصل بعد إرسال النموذج؟",
      en: "What happens after I submit a lead form?",
    },
    answer: {
      ar: "يتم تسجيل الطلب وإرساله إلى مستشار عقاري للتواصل الهاتفي أو عبر واتساب خلال أقرب وقت عمل.",
      en: "The request is logged and routed to an advisor who follows up by phone or WhatsApp during business hours.",
    },
  },
];

export const installmentPlans = [
  {
    title: { ar: "مقدمات تبدأ من 5%", en: "Down payments starting at 5%" },
    description: {
      ar: "خطط مناسبة للمستثمرين الراغبين في الحفاظ على السيولة وتوزيع رأس المال بذكاء.",
      en: "Built for investors who want to preserve liquidity and spread capital efficiently.",
    },
  },
  {
    title: { ar: "أقساط حتى 9 سنوات", en: "Installments up to 9 years" },
    description: {
      ar: "خيارات متنوعة في القاهرة الجديدة والعاصمة الإدارية وغرب القاهرة.",
      en: "Flexible schedules available across New Cairo, the New Capital, and West Cairo.",
    },
  },
  {
    title: { ar: "وحدات جاهزة ووحدات قريبة التسليم", en: "Ready and near-delivery stock" },
    description: {
      ar: "مزيج بين الاستفادة السريعة من الوحدة وإدارة سيولة مدروسة.",
      en: "Balance faster unit utility with a manageable payment structure.",
    },
  },
];

export const featuredDealHighlights = [
  {
    title: { ar: "فرص نادرة في السوق", en: "Rare market opportunities" },
    description: {
      ar: "وحدات إعادة بيع مختارة أو فرص مباشرة يصعب العثور عليها في القنوات التقليدية.",
      en: "Selected resale and direct opportunities that are hard to access through standard channels.",
    },
  },
  {
    title: { ar: "فرص محدودة التداول", en: "Limited-circulation listings" },
    description: {
      ar: "عروض لا يتم تداولها بشكل واسع وتحتاج إلى سرعة قرار مدروسة.",
      en: "Privately circulated opportunities that reward fast, informed decision-making.",
    },
  },
  {
    title: { ar: "أفضلية تفاوضية", en: "Negotiation advantage" },
    description: {
      ar: "بعض الوحدات تفتح مساحة أكبر للتفاوض نتيجة رغبة المالك في التسييل أو سرعة الإغلاق.",
      en: "Certain units offer better negotiation leverage due to seller urgency or quick-close intent.",
    },
  },
];

export const aboutContent = {
  story: {
    ar: "إيمدج للاستثمارات هي شركة تسويق واستشارات عقارية تركز على بناء قرارات شراء واستثمار أكثر دقة داخل أهم الأسواق المصرية. نعمل مع المشترين والمستثمرين من خلال ترشيحات مدروسة، قراءة واضحة للسوق، ومتابعة عملية حتى الوصول إلى أفضل وحدة للعميل.",
    en: "Image Investments is a real estate marketing and advisory company focused on helping buyers and investors make sharper property decisions across Egypt's most in-demand markets. We combine curated opportunities, market intelligence, and active support through every step of the journey.",
  },
  mission: {
    ar: "تقديم استشارات عقارية موثوقة تضع مصلحة العميل أولًا، وتربط بينه وبين فرص حقيقية تناسب أهدافه وميزانيته.",
    en: "To deliver trustworthy real estate advice that puts the client first and connects them with real opportunities aligned with their goals and budget.",
  },
  vision: {
    ar: "أن نكون من الأسماء الأكثر ثقة في الاستشارات والتسويق العقاري داخل مصر، خاصة في فئة العقارات السكنية والاستثمارية المتميزة.",
    en: "To become one of Egypt's most trusted names in premium residential and investment property advisory.",
  },
  values: [
    {
      title: { ar: "الاحترافية", en: "Professionalism" },
      description: {
        ar: "عرض منظم، استجابة سريعة، وفهم عميق للسوق.",
        en: "Structured presentation, fast response, and deep market awareness.",
      },
    },
    {
      title: { ar: "الشفافية", en: "Transparency" },
      description: {
        ar: "تقييم واقعي للفرص مع توضيح المزايا والمخاطر.",
        en: "Realistic evaluation of opportunities with clear upside and risk visibility.",
      },
    },
    {
      title: { ar: "التخصيص", en: "Tailored recommendations" },
      description: {
        ar: "كل ترشيح مبني على هدف العميل وليس على العرض المتاح فقط.",
        en: "Every shortlist is built around the client's goal, not just available stock.",
      },
    },
    {
      title: { ar: "الدعم المستمر", en: "Strong client support" },
      description: {
        ar: "متابعة عملية قبل وبعد المعاينة وحتى الإغلاق.",
        en: "Hands-on support before and after viewings all the way to closing.",
      },
    },
  ],
};

export const investmentHighlights = [
  {
    title: { ar: "إعادة البيع الذكية", en: "High-potential resale plays" },
    description: {
      ar: "فرص سريعة في وحدات مميزة تم شراؤها مبكرًا أو تحتاج إلى تسييل سريع.",
      en: "Fast-moving opportunities in premium units bought early or released for liquidity.",
    },
  },
  {
    title: { ar: "مشروعات بريميوم", en: "Premium compounds" },
    description: {
      ar: "اختيارات داخل كمبوندات ذات طلب قوي وجمهور شراء واضح.",
      en: "Curated inventory within compounds backed by strong buyer demand.",
    },
  },
  {
    title: { ar: "وحدات مصيفية موسمية", en: "Seasonal coastal inventory" },
    description: {
      ar: "شاليهات وفيلات في الساحل والسخنة بعوائد إيجارية موسمية قوية.",
      en: "North Coast and Sokhna opportunities with premium seasonal rental potential.",
    },
  },
  {
    title: { ar: "استثمار تدريجي", en: "Staged investing" },
    description: {
      ar: "حلول تدعم إدارة السيولة والدخول إلى أسواق قوية بخطوات محسوبة.",
      en: "Approaches that help investors preserve liquidity while entering strong markets in controlled steps.",
    },
  },
];

export const blogPosts = [
  {
    slug: "new-cairo-investment-guide",
    title: {
      ar: "لماذا تظل القاهرة الجديدة من أقوى أسواق الاستثمار السكني؟",
      en: "Why New Cairo remains one of Egypt's strongest residential investment markets",
    },
    excerpt: {
      ar: "قراءة في الطلب، نوعية المشترين، وخيارات الشراء التي تمنح قيمة حقيقية للمستثمر.",
      en: "A practical look at demand, buyer profile, and where value still exists in New Cairo.",
    },
    category: { ar: "دليل مناطق", en: "Area Guide" },
    publishedAt: "2026-03-18",
    readTime: { ar: "4 دقائق", en: "4 min" },
    image: bayGallery[3],
  },
  {
    slug: "installment-buying-checklist",
    title: {
      ar: "كيف تقارن بين عقارين بذكاء دون الاكتفاء بالانطباع الأول؟",
      en: "How to compare two properties intelligently beyond first impressions",
    },
    excerpt: {
      ar: "عوامل أساسية لتقييم جودة المنتج، موقعه، وقوة إعادة البيع المتوقعة.",
      en: "Key factors to review across product quality, location strength, and expected resale value.",
    },
    category: { ar: "نصائح شراء", en: "Buying Advice" },
    publishedAt: "2026-02-25",
    readTime: { ar: "5 دقائق", en: "5 min" },
    image: lagoonGallery[3],
  },
  {
    slug: "north-coast-seasonal-yields",
    title: {
      ar: "ما الذي يجعل بعض شاليهات الساحل أكثر قوة في العائد الموسمي؟",
      en: "What makes certain North Coast chalets stronger seasonal-yield performers?",
    },
    excerpt: {
      ar: "الموقع داخل المشروع، القرب من البحر، وسيولة إعادة البيع عوامل حاسمة في تقييم الفرصة.",
      en: "Intra-project positioning, beach proximity, and resale liquidity all matter.",
    },
    category: { ar: "رؤى استثمارية", en: "Investment Insight" },
    publishedAt: "2026-01-30",
    readTime: { ar: "3 دقائق", en: "3 min" },
    image: bayGallery[4],
  },
  {
    slug: "resale-vs-developer-units",
    title: {
      ar: "إعادة البيع أم شراء مباشر من المطور: أيهما أنسب لك؟",
      en: "Resale versus developer inventory: which suits your strategy better?",
    },
    excerpt: {
      ar: "مقارنة عملية بين نوع الوحدة، حالة المشروع، وأثر كل خيار على القرار النهائي.",
      en: "A practical comparison of unit type, project stage, and how each option affects your final decision.",
    },
    category: { ar: "اتجاهات السوق", en: "Market Trend" },
    publishedAt: "2025-12-14",
    readTime: { ar: "6 دقائق", en: "6 min" },
    image: lagoonGallery[4],
  },
];
