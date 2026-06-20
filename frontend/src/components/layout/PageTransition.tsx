"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setEntering(false);
    const id = requestAnimationFrame(() => setEntering(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div className={entering ? "route-enter" : "route-shell"}>
      {children}
    </div>
  );
}
