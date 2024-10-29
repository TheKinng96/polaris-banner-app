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

  return {
    total: discountNodesCount.count,
    discounts,
  };
}
