const serve = require('koa-static');
const koaBody = require('koa-body');
const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = new Koa();

app.use(serve(path.join(__dirname, '/public')));
app.use(koaBody({ multipart: true }));
app.use(async function(ctx, next) {
  await next();
  if (ctx.body || !ctx.idempotent) return;
  ctx.redirect('/404.html');
});

app.use(async function(ctx, next) {
  if ('POST' != ctx.method) return await next();

  const files = ctx.request.body.files.file;
  ctx.body = {
    sizes: files.reduce((o, file) => Object.assign(o, {[file.name]: file.size}), {}),
    files: files.length
  };
});

// listen

app.listen(3000, () => console.log('listening on port 3000'));

