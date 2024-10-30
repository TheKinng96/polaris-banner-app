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
import { getDiscounts } from "../models/Discounts.server.js";
import type { Discount } from "app/types/discounts.types";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  return json(await getDiscounts(admin.graphql));
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

const DiscountTable = ({ discounts }: { discounts: Discount[] }) => (
  <IndexTable
    resourceName={{
      singular: "Banner",
      plural: "Banners",
    }}
    itemCount={discounts.length}
    headings={[
      { title: "Title" },
      { title: "Status" },
      { title: "Usage" },
      { title: "Preview" },
    ]}
    selectable={false}
  >
    {discounts.map((discount, index) => (
      <DiscountTableRow key={discount.id} index={index} discount={discount} />
    ))}
  </IndexTable>
);

const DiscountTableRow = ({
  discount,
  index,
}: {
  discount: Discount;
  index: number;
}) => (
  <IndexTable.Row id={discount.id + ""} position={index}>
    <IndexTable.Cell>
      <Text as="p">{discount.title}</Text>
    </IndexTable.Cell>
    <IndexTable.Cell>{discount.status}</IndexTable.Cell>
    <IndexTable.Cell>{discount.asyncUsageCount}</IndexTable.Cell>
  </IndexTable.Row>
);

export default function DiscountsList() {
  const { total, discounts } = useLoaderData<{
    total: number;
    discounts: Discount[];
  }>();
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
            {total === 0 ? (
              <EmptyQRCodeState onAction={() => navigate("qrcodes/new")} />
            ) : (
              <DiscountTable discounts={discounts} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
