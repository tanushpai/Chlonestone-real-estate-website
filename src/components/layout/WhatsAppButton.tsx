import React from "react";

export default function WhatsAppButton() {
  const whatsappNumber = "971526238780"; // Dubai placeholder number
  const message = encodeURIComponent("Hello! I am interested in off-plan real estate listings.");
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-[#20ba5a] active:scale-95 group"
    >
      {/* Official WhatsApp SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 fill-current transition-transform duration-300 group-hover:rotate-[12deg]"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.863-9.864.001-2.639-1.026-5.122-2.892-6.991C16.376 1.882 13.9 .856 11.26.856 5.823.856 1.396 5.275 1.393 10.722c-.001 1.517.398 2.998 1.157 4.316l-1.095 4.002 4.102-1.076z" />
        <path d="M17.076 14.372c-.27-.135-1.602-.79-1.85-.88-.25-.09-.432-.135-.615.135-.183.27-.708.88-.868 1.06-.16.18-.32.201-.59.066-2.15-1.061-3.52-2.015-4.662-3.977-.3-.518.3-.481.859-1.6.092-.183.046-.344-.023-.48-.068-.135-.615-1.48-.843-2.025-.222-.533-.448-.46-.615-.468-.16-.008-.344-.01-.527-.01-.183 0-.48.069-.731.344-.251.275-.959.937-.959 2.285 0 1.348.981 2.65 1.119 2.835.137.186 1.93 2.947 4.676 4.133.654.282 1.164.45 1.562.577.657.208 1.256.179 1.729.109.528-.078 1.602-.655 1.83-1.256.228-.601.228-1.119.16-1.227-.069-.108-.251-.173-.522-.308z" />
      </svg>
      {/* Tooltip */}
      <span className="absolute right-16 scale-0 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 group-hover:scale-100 whitespace-nowrap shadow-soft">
        Chat with Advisor
      </span>
    </a>
  );
}
