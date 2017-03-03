/*
 * GET home page.
 */

var data = require('../data.json');

exports.view = function(req, res){
        data["redesign"] = false; 
	res.render('index', data);
};

exports.viewRedesign = function(req, res) {
        data["redesign"] = true;
	res.render('index', data);
}
