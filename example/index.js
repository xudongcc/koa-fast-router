const Koa = require('koa')
const routes = require('./routes')

const app = new Koa()

app.use(routes.middleware())
app.listen(3000)
