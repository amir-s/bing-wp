const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const photos = require('./db/parsed');

const { getImage, getStock } = require('./utils');

const app = new Koa();
var router = new Router();

router.get('/v1/photo/random', ctx => {
  const index = Math.floor(Math.random() * photos.length);
  ctx.body = photos[index];
});

router.get('/v1/photo/:index?', async ctx => {
  ctx.body = await getImage(~~ctx.params.index);
});

router.get('/v1/stock/:symbol/:market?', async ctx => {
  const symbol = ctx.params.symbol.replace(/\s/g, '').toUpperCase();
  if (!symbol) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  const market = ctx.params.market && ctx.params.market.replace(/\s/g, '').toUpperCase();

  const data = await getStock(symbol, market);

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
  ctx.body = { version: '0.0.2' };
});

router.get('*', ctx => {
  ctx.status = 404;
  ctx.body = 'Not found';
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = app.callback();
