import { useMemo } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { Layout, Page, Text, BlockStack, PageActions } from "@shopify/polaris";

import { getDiscounts, getBanner } from "../models/Discounts.server";
import type { Banner } from "app/types/banners.types";
import type { Discount } from "app/types/discounts.types";
import { BannerDetails } from "app/componenets/banners/BannerDetails";
import { BannerFormProvider } from "app/contexts/BannerFormContext";
import { BannerPreview } from "app/componenets/banners/BannerPreview";

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
        theme: "info",
        customThemeId: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "PAUSED",
        asyncUsageCount: 0,
        discountStatus: "ACTIVE",
      },
    };

    console.log(data.discounts.availableDiscounts[0]);
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

  /** @type {any} */
  const data = {
    shop,
  };

  return json(data);
}

export default function BannerForm() {
  const { banner, discounts } = useLoaderData<{
    banner: Banner;
    discounts: {
      total: number;
      data: Discount[];
      availableDiscounts: Discount[];
    };
  }>();

  const navigate = useNavigate();

  // Determine if the form is dirty, isSaving, isDeleting, etc.
  // You might need to access state from context or manage it here.

  const options = discounts.availableDiscounts.map((discount) => ({
    label: discount.title,
    value: discount.id,
  }));

  const selectedDiscount = useMemo(
    () =>
      discounts.availableDiscounts.find(
        (discount) => discount.id === banner.discountId,
      ) as Discount,
    [discounts.availableDiscounts, banner.discountId],
  );

  return (
    <BannerFormProvider initialBanner={banner}>
      <Page>
        {/* Title Bar */}
        <ui-title-bar title={banner?.id ? "Edit Banner" : "Create new Banner"}>
          <button variant="breadcrumb" onClick={() => navigate("/app/banners")}>
            Banners
          </button>
        </ui-title-bar>

        <Layout>
          {/* Banner Details */}
          <Layout.Section variant="oneThird">
            <div style={{ marginTop: "var(--p-space-500)" }}>
              <BlockStack gap="500">
                <Text id="storeDetails" variant="headingMd" as="h2">
                  Banner details
                </Text>

                <Text tone="subdued" as="p">
                  Banner will be displayed on the top of your store. Realtime
                  preview is available on the preview section.
                </Text>
              </BlockStack>
            </div>
          </Layout.Section>

          <Layout.Section>
            <BannerDetails
              discounts={discounts}
              options={options}
              selectedDiscount={selectedDiscount}
            />
          </Layout.Section>

          {/* Preview */}
          <Layout.Section>
            <BannerPreview />
          </Layout.Section>

          {/* Page Actions */}
          <Layout.Section>
            <PageActions
              secondaryActions={[
                {
                  content: "Delete",
                  // Add loading, disabled, and onAction properties as needed
                },
              ]}
              primaryAction={{
                content: "Save",
                // Add loading, disabled, and onAction properties as needed
              }}
            />
          </Layout.Section>
        </Layout>
      </Page>
    </BannerFormProvider>
  );
}
