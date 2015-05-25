

//local setting
exports.local = {

	//端口
	port: 4100

	//环境
	,env: 'dev'

	//cdn静态资源地址
	,cdn: 'http://localhost:4100'
	
	//七牛设置 请编辑
	,qiniu: {
		accessKey: '你的七牛accessKey'
		,secretKey: '你的七牛secretKey'
		,callbackUrl: '/qiniu-callback'
		,domain: 'http://你的七牛domain.glb.clouddn.com'
		,https: 'https://你的七牛https URI .qbox.me'
		,proxy: 'http://你的ngrok指定url.ngrok.io' //如果七牛可以访问你的callback地址或者说处于生产环境，请删除这个属性
		,bucketName: '你的七牛空间名称'
	}

}

exports.setting = {

}