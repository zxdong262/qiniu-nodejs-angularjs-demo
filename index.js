
/**
 * Module dependencies.
 */
var
koa = require('koa')
,compress = require('koa-compress')
,serve = require('koa-static')
,conditional = require('koa-conditional-get')
,etag = require('koa-etag')
,jade = require('koa-jade')
,favicon = require('koa-favicon')
,bodyParser = require('koa-bodyparser')
,mount = require('koa-mount')
,router = require('koa-router')()

//user local
,_ = require('lodash')
,local = mm.local
,setting = mm.setting
,port = local.port
,routes = require('./routes/')
,oneYear = 1000 * 60 * 60 * 24 * 365

// all environments
,app = koa()

//middleware
app.keys = [setting.secret]

app.use(conditional())
app.use(etag())

//compression
app.use(compress({
	threshold: 2048
	,flush: require('zlib').Z_SYNC_FLUSH
}))


//favicon
app.use(favicon(__dirname + '/public/favicon.ico', {
	maxAge: oneYear
}))

//static files
app.use(serve(__dirname + '/public', {
	maxAge: oneYear
}))

//log todo

// parse application/x-www-form-urlencoded
app.use(bodyParser())

//view engine
app.use(jade.middleware({
	viewPath: __dirname + '/views'
	,debug: false
	,pretty: false
	,compileDebug: true
	,locals: { _:_ }
	//basedir: 'path/for/jade/extends',
	,noCache: local.env !== 'production'
}))

//routes
routes.init(app)

//start
app.listen(port, function() {
	console.log(new Date() + ' ' + local.siteName + ' runs on port ' + port)
})