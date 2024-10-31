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

export function BannerPreview() {
  const {
    state: { formState, customThemeFormState },
  } = useBannerFormContext();

  let textColor = "rgba(48, 48, 48, 1)";
  let backgroundColor = "white";

  if (formState.theme.includes("custom")) {
    textColor = customThemeFormState.text || textColor;
    backgroundColor = customThemeFormState.background || backgroundColor;
  } else {
    const themeColor = formState.theme[0];
    textColor = defaultColors[themeColor]?.text || textColor;
    backgroundColor = defaultColors[themeColor]?.background || backgroundColor;
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
              color: textColor,
              backgroundColor: backgroundColor,
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
  );
}
