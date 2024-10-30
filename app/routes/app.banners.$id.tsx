import { useCallback, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Bleed,
  Divider,
  InlineStack,
  Layout,
  Page,
  Text,
  TextField,
  BlockStack,
  PageActions,
  Select,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  ChoiceList,
} from "@shopify/polaris";

import { getDiscounts, getBanner } from "../models/Discounts.server";
import type { CustomTheme, Banner, ThemeColor } from "app/types/banners.types";
import { defaultColors } from "app/types/banners.types";
import type { Discount } from "app/types/discounts.types";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    const data = {
      discounts: await getDiscounts(admin.graphql),
      banner: {
        id: 0,
        discountId: 0,
        title: "",
        source: "",
        text: "",
        theme: "info",
        customThemeId: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "ACTIVE",
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
  const maxWidth = "400px";
  const data = useActionData<typeof action>();

  const { banner, discounts } = useLoaderData<{
    banner: Banner;
    discounts: {
      total: number;
      data: Discount[];
      availableDiscounts: Discount[];
    };
  }>();
  const [formState, setFormState] = useState<Banner>(banner);
  const [cleanFormState, setCleanFormState] = useState<Banner>(banner);
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);
  // custom theme
  const [customThemeFormState, setCustomThemeFormState] = useState<CustomTheme>(
    {
      id: 999,
      text: "",
      background: "",
    },
  );

  const nav = useNavigation();

  const isSaving =
    nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const isDeleting =
    nav.state === "submitting" && nav.formData?.get("action") === "delete";

  const navigate = useNavigate();

  const submit = useSubmit();
  function handleSave() {
    const data = {};

    setCleanFormState({ ...formState });
    submit(data, { method: "post" });
  }

  const options = discounts.availableDiscounts.map((discount) => ({
    label: discount.title,
    value: discount.id,
  }));

  const handleSelectChange = useCallback(
    (value: string) => {
      setFormState({
        ...formState,
        discountId: value,
        text:
          formState.text.length === 0
            ? discounts.availableDiscounts.find(
                (discount) => discount.id === value,
              )?.summary || ""
            : formState.text,
      });
    },
    [discounts.availableDiscounts, formState],
  );

  const handleCustomThemeTextChange = useCallback(
    (value: string) =>
      setCustomThemeFormState({
        ...customThemeFormState,
        text: value,
      }),
    [customThemeFormState],
  );

  const handleCustomThemeBgChange = useCallback(
    (value: string) =>
      setCustomThemeFormState({
        ...customThemeFormState,
        background: value,
      }),
    [customThemeFormState],
  );

  const handleChoiceListChange = useCallback(
    (value: string[]) =>
      setFormState({ ...formState, theme: value as ThemeColor[] }),
    [formState],
  );

  const renderChildren = useCallback(
    (isSelected: boolean) =>
      isSelected && (
        <BlockStack gap="200">
          <TextField
            label="Text"
            labelHidden
            onChange={handleCustomThemeTextChange}
            value={customThemeFormState.text}
            autoComplete="off"
          />

          <TextField
            label="Background"
            labelHidden
            onChange={handleCustomThemeBgChange}
            value={customThemeFormState.background}
            autoComplete="off"
          />
        </BlockStack>
      ),
    [
      handleCustomThemeTextChange,
      handleCustomThemeBgChange,
      customThemeFormState,
    ],
  );

  return (
    <Page>
      <ui-title-bar title={banner?.id ? "Edit Banner" : "Create new Banner"}>
        <button variant="breadcrumb" onClick={() => navigate("/app/banners")}>
          Banners
        </button>
      </ui-title-bar>

      <Layout>
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
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <InlineStack
                  align="space-between"
                  gap="500"
                  blockAlign="center"
                >
                  <Text as={"h2"} variant="headingLg">
                    Title
                  </Text>

                  <div style={{ flex: 1, maxWidth }}>
                    <TextField
                      id="title"
                      helpText="Only store staff can see this title"
                      label="title"
                      labelHidden
                      autoComplete="off"
                      value={formState.title}
                      onChange={(title) =>
                        setFormState({ ...formState, title })
                      }
                    />
                  </div>
                </InlineStack>

                <Bleed marginInlineStart="200" marginInlineEnd="200">
                  <Divider />
                </Bleed>

                <InlineStack align="space-between" gap="500" blockAlign="start">
                  <Text as={"h2"} variant="headingLg">
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
                      {discounts.availableDiscounts.find(
                        (discount) => discount.id === formState.discountId,
                      )?.status !== "ACTIVE" ? (
                        <Text as="span" tone="critical">
                          Discount is expired or not active
                        </Text>
                      ) : null}
                    </BlockStack>
                  </div>
                </InlineStack>

                <InlineStack
                  align="space-between"
                  gap="500"
                  blockAlign="center"
                >
                  <Text as={"h2"} variant="headingLg">
                    Text
                  </Text>

                  <div style={{ flex: 1, maxWidth }}>
                    <TextField
                      id="text"
                      label="message"
                      labelHidden
                      autoComplete="off"
                      value={formState.text}
                      onChange={(title) =>
                        setFormState({ ...formState, text: title })
                      }
                    />
                  </div>
                </InlineStack>

                <InlineStack align="space-between" gap="500" blockAlign="start">
                  <Text as={"h2"} variant="headingLg">
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
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as={"h2"} variant="headingLg">
                Preview
              </Text>

              <div
                style={{
                  overflow: "hidden",
                  borderStyle: "solid",
                  borderWidth: "var(--p-border-width-050)",
                  borderColor: "var(--p-color-border-secondary)",
                  borderRadius: "var(--p-border-radius-400)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "1rem 0.5rem",
                    color:
                      defaultColors[formState.theme[0]]?.text ||
                      "rgba(48, 48, 48, 1)",
                    backgroundColor:
                      defaultColors[formState.theme[0]]?.background || "white",
                  }}
                >
                  {formState.text}
                </div>

                <SkeletonPage primaryAction>
                  <Layout>
                    <Layout.Section>
                      <Card>
                        <BlockStack gap="200">
                          <SkeletonDisplayText size="small" />
                          <SkeletonBodyText />
                        </BlockStack>
                      </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneThird">
                      <BlockStack gap="300">
                        <Card>
                          <BlockStack gap="200">
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={2} />
                          </BlockStack>
                        </Card>

                        <Card>
                          <SkeletonBodyText lines={1} />
                        </Card>
                      </BlockStack>
                    </Layout.Section>
                  </Layout>
                </SkeletonPage>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <PageActions
            secondaryActions={[
              {
                content: "Delete",
                loading: isDeleting,
                disabled: !banner.id || !banner || isSaving || isDeleting,
                destructive: true,
                outline: true,
                onAction: () =>
                  submit({ action: "delete" }, { method: "post" }),
              },
            ]}
            primaryAction={{
              content: "Save",
              loading: isSaving,
              disabled: !isDirty || isSaving || isDeleting,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
