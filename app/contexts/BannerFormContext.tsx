import React, { createContext, useContext } from "react";
import { useBannerForm } from "../hooks/useBannerForm";
import type { Banner, CustomTheme } from "../types/banners.types";

interface BannerFormContextType {
  state: {
    formState: Banner;
    customThemeFormState: CustomTheme;
    cleanFormState: Banner;
  };
  updateFormState: (payload: Partial<Banner>) => void;
  updateCustomTheme: (payload: Partial<CustomTheme>) => void;
  resetForm: () => void;
  setCleanFormState: () => void;
}

interface BannerFormProviderProps {
  children: React.ReactNode;
  initialBanner?: Banner;
}

const BannerFormContext = createContext<BannerFormContextType | undefined>(
  undefined,
);

export const BannerFormProvider: React.FC<BannerFormProviderProps> = ({
  children,
  initialBanner,
}) => {
  const bannerForm = useBannerForm(initialBanner);

  return (
    <BannerFormContext.Provider value={bannerForm}>
      {children}
    </BannerFormContext.Provider>
  );
};

export const useBannerFormContext = () => {
  const context = useContext(BannerFormContext);
  if (!context) {
    throw new Error(
      "useBannerFormContext must be used within a BannerFormProvider",
    );
  }
  return context;
};
