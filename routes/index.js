/*
 * routes index
**/

var _ = require('lodash')
,setting = mm.setting
,local = mm.local
,page = require('./page')
,tools = require('../lib/tools')
,ua = require('../lib/ua')
,Router = require('koa-router')
,api = require('./api')

exports.init = function(app) {
	
	var route = new Router()
	var routePage = new Router()


	//qinniu-callback
	route.post(local.qiniu.callbackUrl, api.qiniuCallback)

	//qiniu token
	route.get('/api/get/upload-token', api.getUploadToken)
	

	//page
	routePage.use(function* (next) {
		this.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
		yield next
	})
	routePage.use(ua.ua)
	routePage.get('/', page.index)


	//app
	app.use(tools.settingHandler)
	
	app
	.use(route.routes())
	.use(route.allowedMethods())

	app
	.use(routePage.routes())
	.use(routePage.allowedMethods())

	//404
	app.use(function* (next) {
		this.status =  404
		this.render('page/404',  this.local)
	})

	//end
}