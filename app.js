/*!
 * main entrance
**/

var
glob = require('./glob')
,tools = require('./lib/tools')
,log = tools.log
,setting = mm.setting
,local = mm.local
,_ = require('lodash')
,qiniu = require('qiniu')

try {

	//init qiniu
	mm.qiniu = qiniu
	qiniu.conf.ACCESS_KEY = local.qiniu.accessKey
	qiniu.conf.SECRET_KEY = local.qiniu.secretKey

	//start
	require('./index.js')

} catch(err) {
	log.err(err, '启动失败')
}


