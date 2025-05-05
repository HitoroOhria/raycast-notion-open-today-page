const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

(async () => {
  const response = await notion.search({
    query: 'External tasks',
    filter: {
      value: 'database',
      property: 'object'
    },
    sort: {
      direction: 'ascending',
      timestamp: 'last_edited_time'
    },
  });
  console.log(response);
})();

