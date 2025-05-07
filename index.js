require('dotenv').config()
const open = require('open');
const { Client } = require('@notionhq/client');

// Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Default open page
const dailyPageUrl = 'https://www.notion.so/Daily-36bd146c72f14de5920f9a6ee6b2ad4c';

const padTwoDigits = (num) => {
  return String(num).padStart(2, '0');
}
// Like '2025-05-06' and '2025-05'
const { today, thisMonth } = (() => {
  const now = new Date()
  const year = now.getFullYear();
  const month = padTwoDigits(now.getMonth() + 1);
  const day = padTwoDigits(now.getDate());

  return {
    today: `${year}-${month}-${day}`,
    thisMonth: `${year}-${month}`,
  }
})();

const getTitle = (page) => {
  return page.properties.title.title[0].text.content
};
const getUrl = (page) => {
  return page.url
};

// Open today page.
(async () => {
  // see https://developers.notion.com/reference/post-search
  const response = await notion.search({
    query: today,
    sort: {
      direction: 'descending',
      timestamp: 'last_edited_time'
    },
  });

  const todayPage = response.results.find(page => {
    return getTitle(page) === today
  })
  if (todayPage !== undefined) {
    await open.default(getUrl(todayPage))
    return;
  }

  const thisMonthPage = response.results.find(page => {
    return getTitle(page) === thisMonth
  })
  if (thisMonthPage !== undefined) {
    await open.default(getUrl(thisMonthPage))
    return;
  }

  await open.default(dailyPageUrl)
})();
