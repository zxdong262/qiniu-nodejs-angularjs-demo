/*!
 * apis
**/

var api = exports
,upload = require('../lib/upload')

//qiniu
api.qiniuCallback = upload.qiniuCallback
api.getUploadToken = upload.getUploadToken

