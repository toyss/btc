const path   = require('path')

const Koa    = require('koa')
const static = require('koa-static')

const PORT = 1113
const app = new Koa()

app.use(static(path.join( __dirname, './dist')))

app.listen(PORT, () => console.log(`HTTP Server is running on: http://127.0.0.1:${PORT}`))
