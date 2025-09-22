export const getAllBookmarks = () => {
  if (!(chrome && chrome.bookmarks)) return Promise.resolve([]);

  return new Promise((resolve) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const bookmarks = getAllBookmarksRec(bookmarkTreeNodes[0]);
      resolve(bookmarks);
    });
  });
};

const getAllBookmarksRec = (node) => {
  if (!node.children) {
    return node.url ? [node] : [];
  }

  let arr = [];
  node.children.forEach((child) => {
    arr.push(...getAllBookmarksRec(child));
  });
  return arr;
};
