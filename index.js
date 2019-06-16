const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const photos = require('./db/parsed');

const { getImage } = require('./utils');

const app = new Koa();
var router = new Router();

router.get('/v1/photo/random', ctx => {
  const index = Math.floor(Math.random() * photos.length);
  ctx.body = photos[index];
});

router.get('/v1/photo/:index?', async ctx => {
  ctx.body = await getImage(~~ctx.params.index);
});

router.get('/', ctx => {
  ctx.body = 'Hello!';
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = app.callback();
// app.listen(PORT);
