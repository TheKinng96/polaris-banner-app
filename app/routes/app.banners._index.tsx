import {
  Card,
  EmptyState,
  IndexTable,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getBanners } from "../models/Discounts.server.js";
import type { Banner } from "app/types/banners.types";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request);
  return json(await getBanners());
}

const EmptyQRCodeState = ({ onAction }: { onAction: () => void }) => (
  <EmptyState
    heading="Create unique QR codes for your product"
    action={{
      content: "Create QR code",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Allow customers to scan codes and buy products using their phones.</p>
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
      { title: "Preview" },
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
    <IndexTable.Cell>0</IndexTable.Cell>
  </IndexTable.Row>
);

export default function DiscountsList() {
  const banners = useLoaderData<Banner[]>();
  const navigate = useNavigate();

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
