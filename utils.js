const fetch = require('node-fetch');
const cheerio = require('cheerio');
const pretty = require('pretty');

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

function parseStockDetail(raw) {
  const data =
    /([\d,]+\.?\d*) ([-\+]\d+\.?\d*) \((\d+\.?\d*)%\)(?:After hours:[ \.\d-\+]+\([\d\.%]+\))?([^ ]*)\((.*)\)/.exec(raw);

  if (!data) return null;

  const currencyData = /Currency in ([^ ]*)/.exec(raw);
  const currency = currencyData && currencyData[1];

  return {
    symbol: data[4].toUpperCase(),
    market: data[5].toUpperCase(),
    price: data[1],
    change: data[2],
    changePercentage: data[3],
    currency,
  };
}
const MARKETS = ['TSE', 'TSX', 'TSX-V', 'NASDAQ', 'NYSE', 'AMEX', 'OTCBB', 'INDEXSP'];

async function getStock(symbol, market = 'NYSE') {
  if (!MARKETS.includes(market) || !symbol) {
    return null;
  }

  const r = await fetch(`https://www.google.com/search?q=${escape(symbol)}+${escape(market)}`);
  console.log('status = ', r.status);
  const d = await r.text();
  const $ = cheerio.load(d);

  const rawData = $('span:contains("Stock Price")')
    .parent()
    .parent()
    .find(' > div')
    .find(' > div')
    .text()
    .replace(/\n/g, '');

  console.log('raw data = ', rawData);

  return parseStockDetail(rawData);
}

async function getCrypto(id) {
  try {
    const r = await fetch(`https://api.cryptowat.ch/markets/kraken/${id}usd/summary`);
    const d = await r.json();

    return {
      id: id.toUpperCase(),
      symbol: id.toUpperCase(),
      price: d.result.price.last,
      currency: 'USD',
      changePercentage: d.result.price.change.percentage.toFixed(3),
    };
  } catch (_) {
    return null;
  }
}
async function getWeather(city) {
  try {
    const r = await fetch(`https://www.google.com/search?q=${escape(city)}+weather`);
    const d = await r.text();
    const $ = cheerio.load(d);
    const location = $('span:contains("Weather").BNeawe').parent().prev().prev().text();

    const data = [];
    $('span:contains("Weather").BNeawe')
      .parent()
      .parent()
      .parent()
      .find('div.BNeawe > div')
      .each(function () {
        data.push(cheerio(this).text());
      });

    const [temperatureString, detail] = data;
    const temperature = temperatureString.replace(/[^\d]/g, '');
    const label = detail.split('\n').pop();

    return {
      location,
      temperature,
      label,
    };
  } catch (_) {
    return null;
  }
}

module.exports = {
  getImage,
  parseDescription,
  getStock,
  parseStockDetail,
  getCrypto,
  getWeather,
};
