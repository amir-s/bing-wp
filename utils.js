const fetch = require('node-fetch');

async function getImage(index = 0) {
  const URL = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1`;
  const response = await fetch(URL);
  const {
    images: [{ url, copyright, copyrightlink, title }],
  } = await response.json();
  return {
    url: `https://bing.com${url}`,
    copyright,
    copyrightlink,
    title,
  };
}

module.exports = getImage;
