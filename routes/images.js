var imageData = require('../data.json');

exports.imageJSON = function(req, res) { 
  	res.json(imageData);
}