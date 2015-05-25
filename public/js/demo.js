/*!
 * javascript document for http://cms.long.tv
 */

//main
angular.module('pi', [
	'ngSanitize'
	,'ngAnimate'
	,'ngMessages'
	,'mgcrea.ngStrap'
	,'ui.utils'
	,'utils'
])

.controller('pi', [
	'$scope'
	,'$timeout'
	,'$http'
	,'$alert'
	,'inArray'
	,'removeFromArr'
	,'alert'
	,'setDirty'
	,'initUpload'
	,'updateArr'
	,function Pi(
		$scope
		,$timeout
		,$http
		,$alert
		,inArray
		,removeFromArr
		,alert
		,setDirty
		,initUpload
		,updateArr
	) {

	//start
	var pi = this
	,errWrap = '#msg-wrap'

	pi.files = []

	//handleUploadInfo
	pi.handleUploadInfo = function(info) {

		var obj = JSON.parse(info)

		if(obj.errorMsg) return pi.handleUploadErr(obj.errorMsg, id)
		else if(!obj) return pi.handleUploadErr(info, id)

		var inf = obj.result

		inf.src = mn.qiniu.domain + '/' + inf.key

		pi.files.push(inf)

	}

	pi.handleUploadErr = function(err, id) {
		var _err = err.message || err.errorMsg || err.toString()
		alert(_err, 'danger', '#up1-err')
	}

	//init upload
	initUpload(
		'up1'
		,{
			browse_button: 'upload'
			,drop_element: 'upload'
		}
		,pi
		,$scope
	)

	//end
}])