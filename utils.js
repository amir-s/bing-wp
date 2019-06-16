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

async function getStock(symbol, market = 'nyse') {
  const r = await fetch(`https://www.google.com/search?q=${symbol}+${market}`);
  const d = await r.text();
  const $ = cheerio.load(d);
  const rawPrice = $('span:contains("Stock Price")')
    .parent()
    .next()
    .next()
    .text();

  const priceRegex = /(\d+\.?\d*) ([-\+]\d+\.?\d*) \((\d+\.?\d*)%\)/;
  const priceData = priceRegex.exec(rawPrice);
  if (!priceData) return null;

  const rawCurrency = $('span:contains("Currency in ") span').text();
  const currencyRegex = /Currency in ([^ ]*)/;
  const currencyData = currencyRegex.exec(rawCurrency);

  const currency = currencyData && currencyData[1];

  return {
    symbol: symbol.toUpperCase(),
    market: market.toUpperCase(),
    price: priceData[1],
    change: priceData[2],
    changePercentage: priceData[3],
    currency,
  };
}

module.exports = {
  getImage,
  parseDescription,
  getStock,
};
