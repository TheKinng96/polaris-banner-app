import {
  Card,
  BlockStack,
  Text,
  SkeletonPage,
  Layout,
  SkeletonDisplayText,
  SkeletonBodyText,
} from "@shopify/polaris";
import { useBannerFormContext } from "../../contexts/BannerFormContext";
import { defaultColors } from "../../types/banners.types";
import { useMemo } from "react";

export function BannerPreview() {
  const {
    state: { formState, customThemeFormState },
  } = useBannerFormContext();

  const theme = useMemo(() => {
    let textColor = "rgba(48, 48, 48, 1)";
    let backgroundColor = "white";

    const themeColor = formState.theme[0] || ["info"];

    if (themeColor === "custom" && formState.theme.includes("custom")) {
      textColor = customThemeFormState.text || textColor;
      backgroundColor = customThemeFormState.background || backgroundColor;
    } else {
      textColor = defaultColors[themeColor]?.text || textColor;
      backgroundColor =
        defaultColors[themeColor]?.background || backgroundColor;
    }

    return { textColor, backgroundColor };
  }, [formState.theme, customThemeFormState]);

  if (!formState.theme) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <BlockStack gap="200">
        <Text as="h2" variant="headingLg">
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
              color: theme.textColor,
              backgroundColor: theme.backgroundColor,
            }}
          >
            {formState.text.length === 0 ? "Banner Text" : formState.text}
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
  );
}
