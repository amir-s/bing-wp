const fetch = require('node-fetch');

async function getImage(index = 0) {
  const URL = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=1`;
  const response = await fetch(URL);
  const {
    images: [{ url, copyright, copyrightlink: link, title }],
  } = await response.json();
  return {
    title,
    url: `https://bing.com${url}`,
    link,
    description: parseDescription(copyright),
  };
}

function parseDescription(description) {
  console.log(description);
  const parsed = /([^,]*)(?:, )?(.*) \(©([^\/]*)\/?(.*)\)/.exec(description);

  if (!parsed) {
    return {
      title: '',
      location: '',
      photographer: '',
      source: '',
    };
  }

  return {
    title: parsed[1].trim(),
    location: parsed[2].trim(),
    photographer: parsed[3].trim(),
    source: parsed[4].trim(),
  };
}

module.exports = {
  getImage,
  parseDescription,
};
