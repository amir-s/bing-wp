const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');

const { getImage } = require('./utils');

const PORT = process.env.PORT || 8080;

const app = new Koa();
var router = new Router();

router.get('/:index?', async ctx => {
  ctx.body = await getImage(~~ctx.params.index);
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);
