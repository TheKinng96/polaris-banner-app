import React from "react";
import {
  Card,
  InlineStack,
  Text,
  TextField,
  Select,
  ChoiceList,
  RadioButton,
  BlockStack,
  Bleed,
  Divider,
} from "@shopify/polaris";
import type { ThemeColor, BannerStatus } from "../../types/banners.types";
import { useBannerFormContext } from "../../contexts/BannerFormContext";
import type { Discount } from "app/types/discounts.types";

interface BannerDetailsProps {
  discounts: {
    total: number;
    data: Discount[];
    availableDiscounts: Discount[];
  };
  options: { label: string; value: string }[];
  selectedDiscount: Discount;
}

export function BannerDetails({
  discounts,
  options,
  selectedDiscount,
}: BannerDetailsProps) {
  const {
    state: { formState, customThemeFormState },
    updateFormState,
    updateCustomTheme,
  } = useBannerFormContext();

  const maxWidth = "400px";

  const handleTitleChange = (title: string) => {
    updateFormState({ title });
  };

  const handleStatusChanged = (newStatus: BannerStatus) => {
    updateFormState({ status: newStatus });
  };

  const handleSelectChange = (value: string) => {
    const selectedDiscount = discounts.availableDiscounts.find(
      (discount) => discount.id === value,
    );
    updateFormState({
      discountId: value,
      text:
        formState.text.length === 0
          ? selectedDiscount?.summary || ""
          : formState.text,
      status:
        selectedDiscount?.status !== "ACTIVE" ? "PAUSED" : formState.status,
    });
  };

  const handleChoiceListChange = (value: string[]) => {
    updateFormState({ theme: value as ThemeColor[] });
  };

  const handleCustomThemeTextChange = (value: string) => {
    updateCustomTheme({ text: value });
  };

  const handleCustomThemeBgChange = (value: string) => {
    updateCustomTheme({ background: value });
  };

  const renderChildren = () => {
    if (formState.theme.includes("custom")) {
      return (
        <BlockStack gap="200">
          <TextField
            autoComplete="off"
            label="Text Color"
            value={customThemeFormState.text}
            onChange={handleCustomThemeTextChange}
          />
          <TextField
            autoComplete="off"
            label="Background Color"
            value={customThemeFormState.background}
            onChange={handleCustomThemeBgChange}
          />
        </BlockStack>
      );
    }
    return null;
  };

  return (
    <Card>
      <BlockStack gap="500">
        {/* Title */}
        <InlineStack align="space-between" gap="500" blockAlign="center">
          <Text as="h2" variant="headingLg">
            Title
          </Text>
          <div style={{ flex: 1, maxWidth }}>
            <TextField
              autoComplete="off"
              id="title"
              label="Title"
              value={formState.title}
              onChange={handleTitleChange}
            />
          </div>
        </InlineStack>

        {/* Divider */}
        <Bleed marginInlineStart="200" marginInlineEnd="200">
          <Divider />
        </Bleed>

        {/* Discount */}
        <InlineStack align="space-between" gap="500" blockAlign="start">
          <Text as="h2" variant="headingLg">
            Discount
          </Text>
          <div style={{ flex: 1, maxWidth }}>
            <BlockStack gap="100">
              <Select
                label=""
                options={options}
                onChange={handleSelectChange}
                value={formState.discountId}
              />
              {selectedDiscount?.status !== "ACTIVE" && (
                <Text as="span" tone="critical">
                  Discount is expired or not active
                </Text>
              )}
            </BlockStack>
          </div>
        </InlineStack>

        {/* Status */}
        <BlockStack gap="100">
          <InlineStack align="space-between" gap="500" blockAlign="start">
            <Text as="h2" variant="headingLg">
              Status
            </Text>
            <div style={{ flex: 1, maxWidth }}>
              <BlockStack gap="100">
                <RadioButton
                  label="ACTIVE"
                  id="ACTIVE"
                  name="status"
                  disabled={selectedDiscount?.status !== "ACTIVE"}
                  checked={formState.status === "ACTIVE"}
                  onChange={() => handleStatusChanged("ACTIVE")}
                />
                <RadioButton
                  label="PAUSED"
                  id="PAUSED"
                  name="status"
                  checked={formState.status === "PAUSED"}
                  onChange={() => handleStatusChanged("PAUSED")}
                />
              </BlockStack>
            </div>
          </InlineStack>
          <div
            style={{
              backgroundColor: "var(--p-color-bg-surface-warning)",
              padding: "var(--p-space-200) var(--p-space-400)",
            }}
          >
            <Text tone="subdued" as="p">
              Only a banner can be active at a time.
            </Text>
          </div>
        </BlockStack>

        {/* Text */}
        <InlineStack align="space-between" gap="500" blockAlign="center">
          <Text as="h2" variant="headingLg">
            Text
          </Text>
          <div style={{ flex: 1, maxWidth }}>
            <TextField
              autoComplete="off"
              id="text"
              label="Message"
              value={formState.text}
              onChange={(text) => updateFormState({ text })}
            />
          </div>
        </InlineStack>

        {/* Theme */}
        <InlineStack align="space-between" gap="500" blockAlign="start">
          <Text as="h2" variant="headingLg">
            Theme
          </Text>
          <div style={{ flex: 1, maxWidth }}>
            <ChoiceList
              title=""
              choices={[
                { label: "Info", value: "info" },
                { label: "Danger", value: "danger" },
                { label: "Warn", value: "warn" },
                {
                  label: "Custom Theme",
                  value: "custom",
                  renderChildren,
                },
              ]}
              selected={formState.theme}
              onChange={handleChoiceListChange}
            />
          </div>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
