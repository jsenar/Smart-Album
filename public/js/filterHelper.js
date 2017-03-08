console.log("filterhelper connected");

getImageArray();
//$.get("images/", getImageArray);

function getImageArray(){
	firebase.database().ref('images').once('value', function(snapshot) {

	
		MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	// define what element should be observed by the observer
	// and what types of mutations trigger the callback
		imageData = snapshot.val();
		var imageArray = [];

		console.log(imageData);
	//initial display
		for (var i = 0; i < imageData.length; i++){
			arrayObject = { filename: imageData[i].imageURL, aspectRatio: imageData[i].aspectRatio};
			imageArray.push(arrayObject);
		}

		var pig = new Pig(imageArray, {

			thumbnailSize:1,	
			spaceBetweenImages:2,
			containerID:'pig',		
			urlForSize: function(filename, size) {
				return filename;
			}
		}).enable();

		var target = document.getElementById("taggle_list");
	//console.log(target);

	var observer = new MutationObserver(
		function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type == "childList"){
					filterAll(imageData, taggle.getTags());
				}
			})
		});
 
	// configuration of the observer:
	var config = { attributes: true, childList: true, characterData: true, subtree:true };
 
	// pass in the target node, as well as the observer options
	observer.observe(target, config);
	});
}

function filter(imageData, tags){
	//console.log(imageData.images);
	//console.log(tags.values);
	var imageArray = [];
	var skipImg = false;
	//iterate through each image from the Data
	for (var i = 0; i < imageData.length; i++){
		//console.log(tags.values[i]);
		//console.log(imageData.images[i]);
		if (tags.values.length === 0){
			arrayObject = { filename: imageData[i].imageURL, aspectRatio: imageData[i].aspectRatio};
			imageArray.push(arrayObject);
		}

		//iterate through tag values set in taggle
		for (var j = 0; j < tags.values.length; j++){

			//check if the tag value is in the imageData
			for (var k = 0; k < imageData[i].tags.length; k++){
				if (tags.values[j].toLowerCase() === imageData[i].tags[k].toLowerCase()){
					arrayObject = { filename: imageData[i].imageURL, aspectRatio: imageData[i].aspectRatio};
					imageArray.push(arrayObject);
					//console.log(arrayObject);
					//console.log(imageData.images[i]);
					skipImg = true;
				}
				if (skipImg){
					break;
				}
			}
			if (skipImg){
				break;
			}
		}
		if (skipImg){
			skipImg = false;
		}
	}
	console.log(imageArray);

	pig.disable();

	$("a.pig-figure").remove();
	

	
	pig = new Pig(imageArray, {

			thumbnailSize:1,	
			spaceBetweenImages:2,
			containerID:'pig',		
			urlForSize: function(filename, size) {
				return filename;
			}
		}).enable();
}

// This algorithm is bad and I feel bad for writing it
function filterAll(imageData, tags){
	//console.log(imageData.images);
	//console.log(tags.values);
	var imageArray = [];
	//iterate through each image from the Data
	for (var i = 0; i < imageData.length; i++){
		
		// if there are no tags set, we display all images
		// push the current image and continue
		if (tags.values.length === 0){
			arrayObject = { filename: imageData[i].imageURL, aspectRatio: imageData[i].aspectRatio};
			imageArray.push(arrayObject);
			continue;
		}

		var counter = 0;
		//iterate through tag values set in taggle
		for (var j = 0; j < tags.values.length; j++){

			//check if the tag value is in the imageData
			for (var k = 0; k < imageData[i].tags.length; k++){

				if (tags.values[j].toLowerCase() === imageData[i].tags[k].toLowerCase()){
					// if the tags match, break out of imageData and go to the next taggle.
					//increment that tag counter
					counter++;
					break;
				}
			}
			//on last taggle
			if (j+1 === tags.values.length){
				//add image if the tag counter is equal to the number of taggles
				if (counter === tags.values.length){
					arrayObject = { filename: imageData[i].imageURL, aspectRatio: imageData[i].aspectRatio};
					imageArray.push(arrayObject);
				}
				counter = 0;
			}
		}
	}
	console.log(imageArray);

	//pig.disable();

	$("a.pig-figure").remove();
	
	pig = new Pig(imageArray, {
			thumbnailSize:1,	
			spaceBetweenImages:2,
			containerID:'pig',		
			urlForSize: function(filename, size) {
				return filename;
			}
		}).enable();
}