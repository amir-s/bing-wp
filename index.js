const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const photos = require('./db/parsed');

const { getImage } = require('./utils');

const PORT = process.env.PORT || 8080;

const app = new Koa();
var router = new Router();

router.get('/random', ctx => {
  const index = Math.floor(Math.random() * photos.length);
  ctx.body = photos[index];
});

router.get('/:index?', async ctx => {
  ctx.body = await getImage(~~ctx.params.index);
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);
