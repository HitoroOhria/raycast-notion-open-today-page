require("dotenv").config();
const open = require("open");
const { getTitle, available, getUrl } = require("./notion_page");
const { searchPage, crateTodayPage } = require("./notion_api");

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

// Open today page.
// If not exists, create today page.
const OpenOrCreateTodayPage = async () => {
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
    const todayPage = await crateTodayPage(thisMonthPage.id, today);
    await open.default(getUrl(todayPage));
    return;
  }

  // open daily page.
  await open.default(dailyPageUrl);
};

(async () => {
  // await retrievePageProperties("page_id");
  // await retrieveBlockChildren("page_id");

  await OpenOrCreateTodayPage();
})();
