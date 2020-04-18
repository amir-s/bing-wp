require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const logger = require('koa-logger');

const DB = require('./flatdb');

const photos = require('./db/parsed');

const { getImage, getStock, getCrypto, getWeather } = require('./utils');

const app = new Koa();
const router = new Router();

const db = new DB('./cache.json');

router.get('/v1/photo/random', ctx => {
  const index = Math.floor(Math.random() * photos.length);
  ctx.body = photos[index];
});

router.get('/v1/photo/:index?', async ctx => {
  ctx.body = await getImage(~~ctx.params.index);
});

router.get('/v1/stock/:symbol/:market?', async ctx => {
  const symbol = ctx.params.symbol.replace(/\s/g, '').toUpperCase();
  const format = (ctx.query.format || 'json').toLowerCase();

  if (!symbol) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  const market =
    ctx.params.market && ctx.params.market.replace(/\s/g, '').toUpperCase();

  console.log('requesting stock price for ', symbol, market);

  let data;

  const cached = db.get(`${symbol}-${market}`);
  if (cached) {
    console.log('serving from cache');
    data = cached;
  } else {
    data = await getStock(symbol, market);
    db.set(`${symbol}-${market}`, data);
  }

  if (!data) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  if (format === 'json') {
    ctx.body = data;
  } else if (format === 'text') {
    ctx.body = data.price;
  }
});

router.get('/v1/crypto/:handle', async ctx => {
  const format = (ctx.query.format || 'json').toLowerCase();

  const handle = ctx.params.handle.trim().replace(/\s/g, '-').toLowerCase();

  if (!handle) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  const data = await getCrypto(handle);

  if (!data) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  if (format === 'json') {
    ctx.body = data;
  } else if (format === 'text') {
    ctx.body = data.price;
  }
});

router.get('/v1/weather/:city', async ctx => {
  const city = ctx.params.city.trim().toLowerCase();

  if (!city) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  const data = await getWeather(city);

  if (!data) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  ctx.body = data;
});

router.get('/', ctx => {
  ctx.body = 'Hello!';
});

router.get('/version', ctx => {
  ctx.body = { version: '0.0.6' };
});

router.get('*', ctx => {
  ctx.status = 404;
  ctx.body = 'Not found';
});

app.use(logger()).use(cors()).use(router.routes()).use(router.allowedMethods());

app.listen(process.env.WEB_PORT, process.env.WEB_HOST, () =>
  console.log(`Started server on port #${process.env.WEB_PORT}`)
);
