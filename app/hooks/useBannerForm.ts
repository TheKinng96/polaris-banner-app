import { useReducer, useCallback } from "react";
import type {
  Banner,
  CustomTheme,
  ThemeColor,
  BannerStatus,
} from "../types/banners.types";

type StateType = {
  formState: Banner;
  customThemeFormState: CustomTheme;
  cleanFormState: Banner;
};

type ActionType =
  | { type: "UPDATE_FORM"; payload: Partial<Banner> }
  | { type: "UPDATE_CUSTOM_THEME"; payload: Partial<CustomTheme> }
  | { type: "RESET_FORM" }
  | { type: "SET_CLEAN_FORM_STATE" };

export function useBannerForm(initialBanner?: Banner) {
  const defaultBanner: Banner = initialBanner || {
    id: 0,
    discountId: "",
    title: "",
    source: "",
    text: "",
    theme: ["info"] as ThemeColor[],
    customThemeId: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "PAUSED" as BannerStatus,
    asyncUsageCount: 0,
    discountStatus: "ACTIVE",
  };

  const initialState: StateType = {
    formState: defaultBanner,
    customThemeFormState: {
      id: 999,
      text: "",
      background: "",
    },
    cleanFormState: defaultBanner,
  };

  function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
      case "UPDATE_FORM":
        return {
          ...state,
          formState: { ...state.formState, ...action.payload },
        };
      case "UPDATE_CUSTOM_THEME":
        return {
          ...state,
          customThemeFormState: {
            ...state.customThemeFormState,
            ...action.payload,
          },
        };
      case "RESET_FORM":
        return {
          ...state,
          formState: state.cleanFormState,
        };
      case "SET_CLEAN_FORM_STATE":
        return {
          ...state,
          cleanFormState: state.formState,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateFormState = useCallback(
    (payload: Partial<Banner>) => {
      dispatch({ type: "UPDATE_FORM", payload });
    },
    [dispatch],
  );

  const updateCustomTheme = useCallback(
    (payload: Partial<CustomTheme>) => {
      dispatch({ type: "UPDATE_CUSTOM_THEME", payload });
    },
    [dispatch],
  );

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, [dispatch]);

  const setCleanFormState = useCallback(() => {
    dispatch({ type: "SET_CLEAN_FORM_STATE" });
  }, [dispatch]);

  return {
    state,
    updateFormState,
    updateCustomTheme,
    resetForm,
    setCleanFormState,
  };
}
