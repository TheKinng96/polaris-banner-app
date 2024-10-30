import db from "../db.server";

export async function getDiscounts(graphql) {
  const response = await graphql(`
    query shopInfo {
      discountNodesCount {
        count
      }
      discountNodes(first: 10) {
        edges {
          node {
            id
            discount {
              __typename
              ... on DiscountCodeBasic {
                title
                status
                usageLimit
                summary
                asyncUsageCount
              }
              ... on DiscountCodeBxgy {
                title
                status
                usageLimit
                summary
                asyncUsageCount
              }
              ... on DiscountCodeFreeShipping {
                title
                status
                usageLimit
                summary
                asyncUsageCount
              }
              ... on DiscountAutomaticApp {
                title
                status
                asyncUsageCount
              }
              ... on DiscountAutomaticBasic {
                title
                status
                summary
                asyncUsageCount
              }
              ... on DiscountAutomaticBxgy {
                title
                status
                summary
                asyncUsageCount
              }
              ... on DiscountAutomaticFreeShipping {
                title
                status
                summary
                asyncUsageCount
              }
            }
          }
        }
      }
    }
  `);

  const {
    data: { discountNodes, discountNodesCount },
  } = await response.json();

  // Extract the discount information you need from `discountNodes`
  const discounts = discountNodes.edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.discount.title,
    status: edge.node.discount.status,
    summary: edge.node.discount.summary,
    asyncUsageCount: edge.node.discount.asyncUsageCount,
  }));

  const banners = await db.banner.findMany();
  const bannersDiscountIds = banners.map((banner) => banner.discountId);

  return {
    total: discountNodesCount.count,
    data: discounts,
    availableDiscounts: discounts.filter(
      (discount) => !bannersDiscountIds.includes(discount.id),
    ),
  };
}

export async function getBanner(id, graphql) {
  const banner = await db.banner.findFirst({ where: { id } });

  if (!banner) return null;

  const discount = await getDiscount(banner.id, graphql);

  return {
    ...banner,
    asyncUsageCount: discount.asyncUsageCount,
    discountStatus: discount.status,
  };
}

async function getDiscount(id, graphql) {
  const response = await graphql(
    `
      query getDiscount($id: ID!) {
        discountNode(id: $id) {
          id
          discount {
            __typename
            ... on DiscountCodeBasic {
              title
              status
              usageLimit
              summary
              asyncUsageCount
            }
            ... on DiscountCodeBxgy {
              title
              status
              usageLimit
              summary
              asyncUsageCount
            }
            ... on DiscountCodeFreeShipping {
              title
              status
              usageLimit
              summary
              asyncUsageCount
            }
            ... on DiscountAutomaticApp {
              title
              status
              asyncUsageCount
            }
            ... on DiscountAutomaticBasic {
              title
              status
              summary
              asyncUsageCount
            }
            ... on DiscountAutomaticBxgy {
              title
              status
              summary
              asyncUsageCount
            }
            ... on DiscountAutomaticFreeShipping {
              title
              status
              summary
              asyncUsageCount
            }
          }
        }
      }
    `,
    { id },
  );

  const {
    data: { discountNode },
  } = await response.json();

  return discountNode.discount;
}
