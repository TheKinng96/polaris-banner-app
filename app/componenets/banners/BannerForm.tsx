import { useMemo, useState } from "react";
import { useNavigate, useSubmit } from "@remix-run/react";
import {
  Layout,
  Page,
  Text,
  BlockStack,
  PageActions,
  Modal,
} from "@shopify/polaris";
import type { Discount } from "app/types/discounts.types";
import { BannerDetails } from "app/componenets/banners/BannerDetails";
import { useBannerFormContext } from "app/contexts/BannerFormContext";
import { BannerPreview } from "app/componenets/banners/BannerPreview";

export default function BannerForm() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { state, isDirty, setCleanFormState, availableDiscountList } =
    useBannerFormContext();
  const { formState, customThemeFormState } = state;

  const navigate = useNavigate();
  const submit = useSubmit();

  const isNewBanner = formState.id === 9999;

  const handleBack = () => {
    navigate("/app/banners");
  };

  // const handleCancel = () => {
  //   resetForm();
  //   navigate("/app/banners");
  // };

  const handleDelete = () => {
    navigate("/app/banners");
  };

  const handleSave = () => {
    setCleanFormState();

    const formData = new FormData();
    formData.append("banner", JSON.stringify(formState));
    formData.append("theme", JSON.stringify(customThemeFormState));
    submit(formData, { method: "post" });
  };

  const options = availableDiscountList.map((discount) => ({
    label: discount.title,
    value: discount.id,
  }));

  const selectedDiscount = useMemo(
    () =>
      availableDiscountList.find(
        (discount) => discount.id === formState.discountId,
      ) as Discount,
    [availableDiscountList, formState.discountId],
  );

  return (
    <Page>
      {/* Title Bar */}
      <ui-title-bar title={isNewBanner ? "Create new Banner" : "Edit Banner"}>
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
                content: "Back",
                destructive: false,
                onAction: handleBack,
              },
            ]}
            primaryAction={{
              content: "Save",
              disabled: !isDirty,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Banner"
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: handleDelete,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowDeleteModal(false),
          },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Are you sure you want to delete this banner? This action cannot be
            undone.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
