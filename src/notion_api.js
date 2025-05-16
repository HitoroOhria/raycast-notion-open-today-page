import { Client } from "@notionhq/client";

// Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Function for debug.
// see https://developers.notion.com/reference/retrieve-a-page-property
export const retrievePageProperties = async (pageId) => {
  const response = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: "", // ???
  });
  console.log(response);
};

// Function for debug.
// see https://developers.notion.com/reference/get-block-children
export const retrieveBlockChildren = async (blockId) => {
  const response = await notion.blocks.children.list({
    block_id: blockId, // You can also pass a page id,
    page_size: 50,
  });
  console.log(response);
};

// see https://developers.notion.com/reference/post-search
export const searchPage = async (query) => {
  return await notion.search({
    query,
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  });
};

// see https://developers.notion.com/reference/post-page
export const crateTodayPage = async (parentPageId, title) => {
  return await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    properties: {
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    },
    children: [
      {
        object: "block",
        table_of_contents: {
          color: "default",
        },
      },
      {
        object: "block",
        heading_1: {
          rich_text: [],
        },
      },
      {
        object: "block",
        divider: {},
      },
      // 8 empty lines.
      ...Array(8)
        .fill(null)
        .map(() => ({
          object: "block",
          paragraph: {
            rich_text: [],
          },
        })),
      {
        object: "block",
        heading_1: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "振り返り",
              },
            },
          ],
        },
      },
      {
        object: "block",
        divider: {},
      },
      // 8 empty lines.
      ...Array(8)
        .fill(null)
        .map(() => ({
          object: "block",
          paragraph: {
            rich_text: [],
          },
        })),
    ],
  });
};
