require("dotenv").config();
const open = require("open");
const { Client } = require("@notionhq/client");

// Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Default open page
const dailyPageUrl =
  "https://www.notion.so/Daily-36bd146c72f14de5920f9a6ee6b2ad4c";

const padTwoDigits = (num) => {
  return String(num).padStart(2, "0");
};
// Like '2025-05-06' and '2025-05'
const { today, thisMonth } = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = padTwoDigits(now.getMonth() + 1);
  const day = padTwoDigits(now.getDate());

  return {
    today: `${year}-${month}-${day}`,
    thisMonth: `${year}-${month}`,
  };
})();

const getTitle = (page) => {
  return page.properties.title.title[0].text.content;
};
const available = (page) => {
  return page !== undefined && !page.in_trash;
};
const getUrl = (page) => {
  return page.url;
};

// Function for debug.
// see https://developers.notion.com/reference/retrieve-a-page-property
const retrievePageProperties = async (pageId) => {
  const response = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: "", // ???
  });
  console.log(response);
};

// Function for debug.
// see https://developers.notion.com/reference/get-block-children
const retrieveBlockChildren = async (blockId) => {
  const response = await notion.blocks.children.list({
    block_id: blockId, // You can also pass a page id,
    page_size: 50,
  });
  console.log(response);
};

// see https://developers.notion.com/reference/post-search
const searchPage = async (query) => {
  return await notion.search({
    query,
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  });
};

// see https://developers.notion.com/reference/post-page
const crateTodayContentsPage = async (parentPageId, title) => {
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

// Open today page.
const openTodayPage = async () => {
  const response = await searchPage(today);

  // open today page.
  const todayPage = response.results.find((page) => {
    return getTitle(page) === today;
  });
  if (available(todayPage)) {
    await open.default(getUrl(todayPage));
    return;
  }

  // create and open today page.
  const thisMonthPage = response.results.find((page) => {
    return getTitle(page) === thisMonth;
  });
  if (available(thisMonthPage)) {
    const todayPage = await crateTodayContentsPage(thisMonthPage.id, today);
    await open.default(getUrl(todayPage));
    return;
  }

  // open daily page.
  await open.default(dailyPageUrl);
};

(async () => {
  // await retrievePageProperties("page_id");
  // await retrieveBlockChildren("page_id");

  await openTodayPage();
})();
