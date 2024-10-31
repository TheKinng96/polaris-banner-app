import {
  Button,
  Card,
  EmptyState,
  IndexTable,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getBanners } from "../models/Discounts.server.js";
import { defaultColors, type Banner } from "app/types/banners.types";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const banners = await getBanners(admin.graphql);

  return json(banners as unknown as Banner[]);
}

export default function DiscountsList() {
  const banners = useLoaderData<Banner[]>();
  const navigate = useNavigate();

  const showPreview = (banner: Banner) => {
    const existingBanner = document.getElementById("banner-preview-123");

    if (existingBanner) {
      // If banner exists, remove it
      existingBanner.remove();
    } else {
      const previewBanner = createBanner(banner);
      document.body.prepend(previewBanner);
    }
  };

  const createBanner = (banner: Banner) => {
    const previewBanner = document.createElement("div");
    previewBanner.id = "banner-preview-123";
    previewBanner.style.color =
      banner.themeDetails?.text || defaultColors.info.text;
    previewBanner.style.backgroundColor =
      banner.themeDetails?.background || defaultColors.info.background;
    previewBanner.style.width = "100%";
    previewBanner.style.display = "flex";
    previewBanner.style.justifyContent = "center";
    previewBanner.style.padding = "1rem 0.5rem";
    previewBanner.style.top = "0";
    previewBanner.innerText = banner.text;
    return previewBanner;
  };

  const EmptyQRCodeState = ({ onAction }: { onAction: () => void }) => (
    <EmptyState
      heading="Create discount banner for your store to increase the conversion!"
      action={{
        content: "Create Banner",
        onAction,
      }}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>Promote your store by creating discount banner.</p>
    </EmptyState>
  );

  const BannerTable = ({ banners }: { banners: Banner[] }) => (
    <IndexTable
      resourceName={{
        singular: "Banner",
        plural: "Banners",
      }}
      itemCount={banners.length}
      headings={[
        { title: "Title" },
        { title: "Status" },
        { title: "Usage" },
        { title: "Actions" },
      ]}
      selectable={false}
    >
      {banners.map((banner, index) => (
        <BannerTableRow key={banner.id} index={index} banner={banner} />
      ))}
    </IndexTable>
  );

  const BannerTableRow = ({
    banner,
    index,
  }: {
    banner: Banner;
    index: number;
  }) => (
    <IndexTable.Row id={banner.id + ""} position={index}>
      <IndexTable.Cell>
        <Text as="p">{banner.title}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{banner.status}</IndexTable.Cell>
      <IndexTable.Cell>{banner.asyncUsageCount}</IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Button onClick={() => showPreview(banner)}>Preview</Button>
          <Button onClick={() => navigate(`/app/banners/${banner.id}`)}>
            Edit
          </Button>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  );

  return (
    <Page>
      <ui-title-bar title="Banners">
        <button variant="primary" onClick={() => navigate("new")}>
          Add new banner
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {banners.length === 0 ? (
              <EmptyQRCodeState onAction={() => navigate("/app/banners/new")} />
            ) : (
              <BannerTable banners={banners} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
