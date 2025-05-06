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
// Like '2025-05-06'
const today = (() => {
  const now = new Date()
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return `${year}-${padTwoDigits(month)}-${padTwoDigits(day)}`
})();

const getTitle = function(page) {
  return page.properties.title.title[0].text.content
};
const getUrl = function(page) {
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

  const url = todayPage === undefined ? dailyPageUrl : getUrl(todayPage)
  await open.default(url)
})();

