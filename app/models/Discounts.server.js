import { defaultColors } from "../types/banners.types";
import db from "../db.server";

export async function getDiscounts(graphql) {
  const response = await graphql(`
    query getDiscounts {
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
    data: { discountNodes },
  } = await response.json();

  // Extract the discount information you need from `discountNodes`
  const discounts = discountNodes.edges.map((edge) => ({
    id: edge.node.id,
    title: edge.node.discount.title,
    status: edge.node.discount.status,
    summary: edge.node.discount.summary,
    asyncUsageCount: edge.node.discount.asyncUsageCount,
  }));

  return discounts;
}

export async function getAvailableDiscountList(graphql) {
  const banners = await db.banner.findMany();
  const bannersDiscountIds = banners.map((banner) => banner.discountId);

  const discounts = await getDiscounts(graphql);
  return discounts.filter(
    (discount) => !bannersDiscountIds.includes(discount.id),
  );
}

export async function getBanner(id, graphql) {
  const banner = await db.banner.findFirst({ where: { id } });

  if (!banner) return null;

  const discount = await getDiscount(banner.discountId, graphql);

  let bannerTheme = null;
  if (banner.customThemeId) {
    bannerTheme = await db.theme.findFirst({
      where: { id: banner.customThemeId },
    });
  }

  const theme = JSON.parse(banner.theme);

  return {
    banner: {
      ...banner,
      theme,
      asyncUsageCount: discount.asyncUsageCount,
      discountStatus: discount.status,
      themeDetails: banner.customThemeId
        ? bannerTheme
        : defaultColors[theme[0]],
    },
    discount,
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
    {
      variables: {
        id,
      },
    },
  );

  const {
    data: { discountNode },
  } = await response.json();

  return {
    id: discountNode.id,
    title: discountNode.discount.title,
    status: discountNode.discount.status,
    summary: discountNode.discount.summary,
    asyncUsageCount: discountNode.discount.asyncUsageCount,
  };
}

export async function getBanners(graphql) {
  const discounts = await getDiscounts(graphql);
  const banners = await db.banner.findMany();
  const themes = await db.theme.findMany();

  banners.forEach((banner) => {
    const discount = discounts.find(
      (discount) => discount.id === banner.discountId,
    );
    banner.asyncUsageCount = discount.asyncUsageCount;
    banner.theme = JSON.parse(banner.theme);
    banner.discountStatus = discount.status;

    if (banner.customThemeId) {
      banner.themeDetails = themes.find(
        (theme) => theme.id === banner.customThemeId,
      );
    } else {
      banner.themeDetails = defaultColors[banner.theme[0]];
    }
  });

  return banners;
}
