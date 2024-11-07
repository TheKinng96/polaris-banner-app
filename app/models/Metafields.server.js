import db from "../db.server";

export async function createMetaFields(graphql, metafields) {
  const response = await graphql(
    `
      mutation CreateAppDataMetafield(
        $metafieldsSetInput: [MetafieldsSetInput!]!
      ) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafieldsSetInput: metafields,
      },
    },
  );

  const {
    data: { metafieldsSet },
  } = await response.json();

  return metafieldsSet.metafields;
}
