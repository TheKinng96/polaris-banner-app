import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

import {
  getAvailableDiscountList,
  getBanner,
} from "../models/Discounts.server";
import type { Banner, CustomTheme } from "app/types/banners.types";
import type { Discount } from "app/types/discounts.types";
import { BannerFormProvider } from "app/contexts/BannerFormContext";
import BannerForm from "app/componenets/banners/BannerForm";
import db from "../db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    const availableDiscountList = await getAvailableDiscountList(admin.graphql);
    const data = {
      availableDiscountList,
      banner: {
        id: 9999,
        discountId: availableDiscountList[0].id,
        title: "",
        source: "",
        text: availableDiscountList[0].summary,
        theme: ["info"],
        customThemeId: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "PAUSED",
        asyncUsageCount: 0,
        discountStatus: "ACTIVE",
      },
    };

    return json(data);
  }

  return json({
    availableDiscountList: [],
    banner: await getBanner(Number(params.id), admin.graphql),
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const { id: themeId, ...customThemeData } = JSON.parse(
    formData.get("theme") as string,
  );
  const bannerData = JSON.parse(formData.get("banner") as string);

  // Generate the tag and put in the store tag script

  let newTheme: CustomTheme | null = null;
  if (bannerData.theme[0] === "custom" && customThemeData.text.length > 0) {
    newTheme = await db.theme.create({
      data: {
        text: customThemeData.text,
        background: customThemeData.background,
      },
    });
  }

  const banner = await db.banner.create({
    data: {
      discountId: bannerData.discountId,
      title: bannerData.title,
      source: bannerData.source,
      text: bannerData.text,
      theme: JSON.stringify(bannerData.theme),
      status: bannerData.status,
      customThemeId: newTheme?.id ?? undefined,
    },
  });

  console.log("in action", banner);
  /** @type {any} */
  const data = {
    shop,
  };

  return redirect("/app/banners");
}

export default function BannerFormView() {
  const { banner, availableDiscountList } = useLoaderData<{
    banner: Banner;
    availableDiscountList: Discount[];
  }>();

  return (
    <BannerFormProvider
      initialBanner={banner}
      availableDiscountList={availableDiscountList}
    >
      <BannerForm />
    </BannerFormProvider>
  );
}
