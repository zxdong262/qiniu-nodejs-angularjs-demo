var _ = require('lodash')
,local = mm.local
,setting = mm.setting
,tools = require('./tools')
,log = tools.log
,co = require('co')
,shortid = require('shortid')
,qiniu = mm.qiniu
,qs = require('querystring')
,crypto = require('crypto')

exports.getUploadToken = function* (next) {

	try {
		var bucketName = local.qiniu.bucketName
		,body = this.query
		,type = body.type
		,putPolicy = new qiniu.rs.PutPolicy(bucketName)
		,callbackBodyObj

		if(type !== 'image' && type !== 'video') return this.body = {
			code: 1
			,errorMsg: 'upload type wrong'
		}

		if(type === 'image') callbackBodyObj = {
			name: '$(fname)'
			,hash: '$(etag)'
			,imageInfo: '$(imageInfo)'
			,fsize: '$(fsize)'
			,key: '$(key)'
			,ext: '$(ext)'
			,bucket: '$(bucket)'
		}

		else callbackBodyObj = {
			name: '$(fname)'
			,hash: '$(etag)'
			,avinfo: '$(avinfo)'
			,fsize: '$(fsize)'
			,key: '$(key)'
			,ext: '$(ext)'
			,bucket: '$(bucket)'
			,persistentId: '$(persistentId)'
		}

		var fqb = qs.stringify(callbackBodyObj).replace(/\%24/g, '$')

		_.extend(putPolicy,
			{
				callbackUrl: (local.qiniu.proxy?local.qiniu.proxy:this.local.host) + local.qiniu.callbackUrl
				,callbackBody: fqb
				,expires: 3600
			}
		)

		this.body = {
			code: 0
			,uptoken: putPolicy.token()
		}
	}
	catch(e) {
		log.err(e, 'getUploadToken失败')
		return this.body = {
			code: 1
			,errorMsg: 'getUploadToken失败;' + e
		}
	}



}

//from qiniu sdk
exports.hmacSha1 = function(encodedFlags, secretKey) {
	/*
	 *return value already encoded with base64
	* */
	var hmac = crypto.createHmac('sha1', secretKey)
	hmac.update(encodedFlags)
	return hmac.digest('base64')
}

exports.validateCallback = function(code, path, body) {

	//return true

	//QBox iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV:tDK-3f5xF3SJYEAwsll5g=
	if(!/^QBox /.test(code)) return false

	var arr = code.slice(5).split(':')
	if(arr.length !== 2 || arr[0] !== local.qiniu.accessKey) return false

	return true

/*
	以下试图验证七牛calllback的不成功尝试
	var data = path + '/n' + encodeURIComponent(JSON.stringify(body))
	
	return exports.hmacSha1(data, local.qiniu.secretKey) === arr[1]


	//expect:  vXYh1MFPN6bo3w-1O4RMCN9zetk=
	//path: '/qiniu-callback'
	//body: "{"name":"download.png","hash":"FoO0slsknA9mFVKcVo4D3wUzHpWW","imageInfo":"{\"format\":\"png\",\"width\":200,\"height\":200,\"colorModel\":\"nrgba\"}","fsize":"3908","key":"FoO0slsknA9mFVKcVo4D3wUzHpWW","ext":".png","bucket":"zxdong262"}"

	function processBody(body) {
		var res = ''
		_.forEach(body, function(v, k) {
			res += '&' + k + '=' + v
		})
		return res.slice(1)
	}
	
	exports.hmacSha1(data, local.qiniu.secretKey)

*/

}

exports.qiniuCallback = function* (next) {

	try {	

		var code = this.get('Authorization')

		var body = this.request.body

		if(!exports.validateCallback(code, this.originalUrl, body)) return this.body = {
			code: 1
			,errorMsg: 'duang!'
		}

		var bodyObj = body

		bodyObj._id = bodyObj.hash

		return this.body = {
			code: 0
			,result: bodyObj
		}

	}
	catch(e) {
		log.err(e, 'qiniuCallback失败')
		return this.body = {
			code: 1
			,errorMsg: 'qiniuCallback失败;' + e
		}
	}

	//end
}