/*
 * page
**/

exports.index = function* (next) {
	
	this.render('page/index', this.local)

}