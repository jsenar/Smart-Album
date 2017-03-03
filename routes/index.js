/*
 * GET home page.
 */

var data = require('../data.json');

exports.view = function(req, res){
	/*var tagMap = {};
	var uniqueTags = [];
	for (var image in data['images']){
		for (var tag in image['tags']){
			if (!tagMap.hasOwnProperty(tag)){
				uniqueTags.push(tag);
				tagMap(tag)=1;
			}
		}
	}
	data.push(uniqueTags);*/
	console.log(data)
        data["redesign"] = false; 
	res.render('index', data);

};

exports.viewRedesign = function(req, res) {
        data["redesign"] = true;
	res.render('index', data);
}
