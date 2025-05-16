export const getTitle = (page) => {
  return page.properties.title.title[0].text.content;
};

export const available = (page) => {
  return page !== undefined && !page.in_trash;
};

export const getUrl = (page) => {
  return page.url;
};
