import { getUiCopy, type Locale } from "@/lib/i18n";
import { companyProfile } from "@/lib/site-data";

type WhatsAppFloatProps = {
  locale: Locale;
};

export function WhatsAppFloat({ locale }: WhatsAppFloatProps) {
  const copy = getUiCopy(locale);

  return (
    <a
      href={companyProfile.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label={copy.actions.askWhatsapp}
      className="floating-whatsapp fixed bottom-5 right-5 z-50 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)]"
    >
      {copy.actions.whatsapp}
    </a>
  );
}
