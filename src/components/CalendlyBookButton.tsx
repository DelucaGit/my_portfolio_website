"use client";

const CALENDLY_URL = "https://calendly.com/malakdeluca/introduktionsm-te";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function CalendlyBookButton({ className, children }: Props) {
  function handleClick() {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      return;
    }
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
