import { ReactNode } from "react";

import { MarketingHeader } from "../Header/MarketingHeader";

interface MarketingLayoutProps {
  children: ReactNode;
  showFooterGradient?: boolean;
}

export function MarketingLayout({ children, showFooterGradient = true }: MarketingLayoutProps) {
  return (
    <div className="bg-luxury-black min-h-screen">
      <MarketingHeader />
      {children}
      {showFooterGradient && <div className="from-gold/20 h-32 bg-gradient-to-t to-transparent" />}
    </div>
  );
}
