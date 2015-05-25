(function(window, undefined) {


//utils
angular.module('utils', [
	'ngSanitize'
	,'ngAnimate'
	,'ngMessages'
	,'mgcrea.ngStrap'
])

.service('setDirty', function setDirty() {
	return function(form) {
		angular.forEach(form, function(value, key) {
			if(!/^\$/.test(key)) form[key].$setDirty()
		})
	}
})

.service('alert', ['$alert', function alert($alert) {
	return 	function(msg, type, container) {
		$alert({
			title: 'duang!'
			,content: msg || ''
			,type: type || 'danger'
			,container: container || 'body' 
			,duration: 10
		})
	}
}])

.service('removeFromArr', function removeFromArr() {
	return function(arr, item) {
		for(var i = 0, len = arr.length;i < len;i ++) {
			if(angular.equals(arr[i], item)) {
				arr.splice(i, 1)
				break
			}
		}
		return arr
	}
})

.service('updateArr', function removeFromArr() {
	return function(arr, item, newOne) {
		for(var i = 0, len = arr.length;i < len;i ++) {
			if(angular.equals(arr[i], item)) {
				arr.splice(i, 1, newOne)
				break
			}
		}
		return arr
	}
})

.service('inArray', function inArray() {
	return function(arr, item) {

		var res = -1
		for(var i = 0, len = arr.length;i < len;i ++) {
			if(angular.equals(arr[i], item)) {
				res = i
				break
			}
		}
		return res
	}
})

.service('initUpload', function() {

	/*
		id: uploader id every file input should be unique
		options: init options, as follow
		ctx: controller context
		$scope: controller $scope

	*/
	return function(id, options, ctx, $scope) {


		//from qiniu sdk
		var defaults = {
			runtimes: 'html5,flash,html4',    //上传模式,依次退化
			browse_button: 'upload',       //上传选择的点选按钮，**必需**
			uptoken_url: mn.host + '/api/get/upload-token?type=image',
					//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
			// uptoken : '<Your upload token>',
					//若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
			// unique_names: true,
					// 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
			// save_key: true,
					// 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
			domain: location.protocol === 'http:'?mn.qiniu.domain:mn.qiniu.https,
					//bucket 域名，下载资源时用到，**必需**
			container: 'wrapper',           //上传区域DOM ID，默认是browser_button的父元素，
			max_file_size: '500k',           //最大文件体积限制
			flash_swf_url: mn.cdn + '/share/js/vender/plupload/Moxie.swf',  //引入flash,相对路径
			max_retries: 2,                   //上传失败最大重试次数
			//multi_selection: false,            //选择多个文件
			dragdrop: true,                   //开启可拖曳上传
			drop_element: 'upload',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
			chunk_size: '4mb',                //分块上传时，每片的体积
			auto_start: true,                //选择文件后自动上传，若关闭需要自己绑定事件触发上传
			filters: {
				mime_types : [
					{ title : 'Image files', extensions : 'jpg,png,gif' }
				]
			},
			init: {
					'FilesAdded': function(up, files) {

						$scope.$apply(function() {
							ctx.onupload = true
							// plupload.each(files, function(file) {
							// 	ctx.files.push(file)
							// })
						})

					},
					
					'BeforeUpload': function(up, file) {

						// 每个文件上传前,处理相关的事情
					},
					'UploadProgress': function(up, file) {
						console.log(file)
					},
					'FileUploaded': function(up, file, info) {

						$scope.$apply(function() {
							ctx.handleUploadInfo(info, id)
						})
						
						 // 每个文件上传成功后,处理相关的事情
						 // 其中 info 是文件上传成功后，服务端返回的json，形式如
						 // {
						 //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
						 //    "key": "gogopher.jpg"
						 //  }
						 // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
						 // var domain = up.getOption('domain');
						 // var res = parseJSON(info);
						 // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
					},
					'Error': function(up, err, errTip) {

						//上传出错时,处理相关的事情
						$scope.$apply(function() {
							ctx.handleUploadErr(err, id)
						})

					},
					'UploadComplete': function() {

						//队列文件处理完毕后,处理相关的事情
						//重置。。。
						//mn.uploadIds[id] = Qiniu.uploader( angular.extend({}, defaults, options) )

						$scope.$apply(function() {
							ctx.onupload = false
						})
						
					},
					'Key': function(up, file) {
							// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
							// 该配置必须要在 unique_names: false , save_key: false 时才生效
							//var key = "";
							// do something with key here
							//return key
					}
			}
		}

		var defs = angular.extend({}, defaults, options)
		mn.uploadIds = mn.uploadIds || {}
		mn.uploadIds[id] = Qiniu.uploader(defs)

		////temp:test qiniu upload
		////
	}

})

})(window)