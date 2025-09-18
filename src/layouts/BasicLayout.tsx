import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCartAndFavoritesAutoMerge } from "@/utils/hooks/useCartAndFavoritesAutoMerge";

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  useCartAndFavoritesAutoMerge();

  const [paddingStyle, setPaddingStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 1024) {
        setPaddingStyle({ padding: "16px 16px 80px 16px" }); // Mobile
      } else {
        setPaddingStyle({ padding: "16px 50px 80px 50px" }); // Desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen h-full flex flex-col">
      <Header />
      <main
        style={{
          ...paddingStyle,
          margin: "auto",
          maxWidth: 1280,
          width: "100%",
          flex: 1,
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BasicLayout;
