//local setting

var 
_ = require('lodash')
,sid = require('shortid')
,local = {
	siteName: 'qiniu-nodejs-demo'
	,siteDesc: 'qiniu nodejs demo'
	,version: new Date().getTime()
	,icons: require('./data/icons')
}

,setting = {

}

,config = require('./config')

global.mm = {
	setting: _.extend(setting, config.setting)
	,local: _.extend(local, config.local)
}