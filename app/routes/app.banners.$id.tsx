import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

import { getDiscounts, getBanner } from "../models/Discounts.server";
import type { Banner, CustomTheme } from "app/types/banners.types";
import type { Discount } from "app/types/discounts.types";
import { BannerFormProvider } from "app/contexts/BannerFormContext";
import BannerForm from "app/componenets/banners/BannerForm";
import db from "../db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    const discounts = await getDiscounts(admin.graphql);
    const data = {
      discounts,
      banner: {
        id: 9999,
        discountId: discounts.availableDiscounts[0].id,
        title: "",
        source: "",
        text: "",
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
    discounts: [],
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

  return json(data);
}

export default function BannerFormView() {
  const { banner, discounts } = useLoaderData<{
    banner: Banner;
    discounts: {
      total: number;
      data: Discount[];
      availableDiscounts: Discount[];
    };
  }>();

  return (
    <BannerFormProvider initialBanner={banner} discounts={discounts}>
      <BannerForm />
    </BannerFormProvider>
  );
}
