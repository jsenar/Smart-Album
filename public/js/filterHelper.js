console.log("filterhelper connected");
//var imagesToFilter = document.querySelectorAll("#lightgallery .imagesToFilter");
//var checkBoxes = document.querySelectorAll("#filterModal .checkbox label input");
	
$.get("images/", getImageArray);

function getImageArray(result){
	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	// define what element should be observed by the observer
	// and what types of mutations trigger the callback
	imageData = result;
	var target = document.getElementById("taggle_list");
	//console.log(target);

	var observer = new MutationObserver(
		function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type == "childList"){
					filter(imageData, taggle.getTags());
				}
			})
		});
 
	// configuration of the observer:
	var config = { attributes: true, childList: true, characterData: true, subtree:true };
 
	// pass in the target node, as well as the observer options
	observer.observe(target, config);
}

function filter(imageData, tags){
	//console.log(imageData.images);
	//console.log(tags.values);
	var imageArray = [];
	var skipImg = false;
	//iterate through each image from the Data
	for (var i = 0; i < imageData.images.length; i++){
		//console.log(tags.values[i]);
		//console.log(imageData.images[i]);

		//iterate through tag values set in taggle
		for (var j = 0; j < tags.values.length; j++){

			//check if the tag value is in the imageData
			for (var k = 0; k < imageData.images[i].tags.length; k++){
				if (tags.values[j].toLowerCase() === imageData.images[i].tags[k].toLowerCase()){
					arrayObject = { filename: imageData.images[i].imageURL, aspectRatio: imageData.images[i].aspectRatio};
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

	$("a.pig-figure").remove();
	
	pig.disable();
	
	pig = new Pig(imageArray, {

			thumbnailSize:1,	
			spaceBetweenImages:2,
			containerID:'pig',		
			urlForSize: function(filename, size) {
				return filename;
			}
		}).enable();
}



// setup click event handlers on filter checkboxes
/*for (var i = 0; i < checkBoxes.length; i++) {
	checkBoxes[i].addEventListener("click", filterImages , false);
	checkBoxes[i].checked = true;
	checkBoxMap.set(checkBoxes[i].value, checkBoxes[i].checked)
}

// click event handler function
function filterImages(e) {
 	var clickedItem = e.target;
 	checkBoxMap.set(clickedItem.value, clickedItem.checked);
	console.log("clicked");
        console.log("clicked item value: " + clickedItem.value);
	if (clickedItem.checked == true) {
		hideOrShowItems(clickedItem.value, "hideItem", "showItem");
		console.log("checked");
	}
	else if (clickedItem.checked == false) {
		hideOrShowItems(clickedItem.value, "showItem", "hideItem");
		console.log("unchecked");
	}
}

function filterImagesVoice(tagsArray) {
	console.log("filtering from voice input");
	var matchedTag = false;
	for (var i = 0; i < checkBoxes.length; i++) {
            // if voice tag is a valid filter tag, mark as checked + show image
	    console.log(checkBoxes[i].value);
	    console.log(tagsArray);
	    // get checkbox tags, match to lowercase on compare
	    if (tagsArray.indexOf(checkBoxes[i].value.toLowerCase()) >= 0) {
                checkBoxes[i].checked = true;
		hideOrShowItems(checkBoxes[i].value, "hideItem", "showItem");
		matchedTag = true;
	    }
	}

	if (matchedTag) {
           document.getElementById("STToutput").innerHTML += ("\n" + "I managed to find images with what you said. Close this menu to check them out!");
	}
	else {
           document.getElementById("STToutput").innerHTML += ("\n" + "I am sorry. I was unable to find any pictures with what you said.");
	}
}

// add or remove classes to show/hide the images
function hideOrShowItems(itemType, classToRemove, classToAdd) {
	var i, j, k;
	var flag = false;

	// Loop through all images
	for (i = 0; i < imagesToFilter.length; i++) {
		var currentItem = imagesToFilter[i];

		// Get tags of current images
		var imageTagsString = currentItem.getAttribute("data-type");
		console.log(Object.prototype.toString.call(imageTagsString));

		var imageTags = imageTagsString.split(",");
		console.log(Object.prototype.toString.call(imageTags));
		console.log("Image " + i + "Tags : " + imageTags);

		var skipImg = true;
		//pre-loop to check if itemType is a tag for the image
		for (j = 0; j < imageTags.length; j++){
			if (imageTags[j] == itemType){
				skipImg = false;
			}
		}
		if (skipImg == true){
			continue;
		}

		//itemType is the only tag for the image so mark flag as true
		if (imageTags.length == 1){
			console.log("True, hide/show");
			flag = true;
		}

		var tagsMatch = false;
		var prev;
		var itemTypeChecked = checkBoxMap.get(itemType);

		//if itemType was checked, show items 
		if (itemTypeChecked){
			flag = true;
		}
		//if itemType was unchecked, hide if all others are unchecked
		else{
			first = checkBoxMap.get(imageTags[0]);
			flag = true;
			for (j = 1; j < imageTags.length; j++){
				//if tag checkbox is checked, continue to next iteration
				if (checkBoxMap.get(imageTags[j]) !== first){
					flag = false;
					break;
				}
			}
		}


		// indexOf checks if the images tag(s) contain tag(s)
		if (currentItem.getAttribute("data-type").indexOf(itemType) >= 0
				&& flag == true) {
			console.log("show/hide");
			console.log(currentItem.getAttribute("data-type"));
			removeClass(currentItem, classToRemove);
			addClass(currentItem, classToAdd);
		}
	}
}

// helper functions for adding removing class values
function addClass(element, classToAdd) {
	var currentClassValue = element.className;
	
	if (currentClassValue.indexOf(classToAdd) == -1) {
        	if ((currentClassValue == null) || (currentClassValue === "")) {
            		element.className = classToAdd;
        } else {
            element.className += " " + classToAdd;
        }
    }
}
        
function removeClass(element, classToRemove) {
    var currentClassValue = element.className;
  
    if (currentClassValue == classToRemove) {
        element.className = "";
        return;
    }
  
    var classValues = currentClassValue.split(" ");
    var filteredList = [];
  
    for (var i = 0 ; i < classValues.length; i++) {
        if (classToRemove != classValues[i]) {
            filteredList.push(classValues[i]);
        }
    }
  
    element.className = filteredList.join(" ");
}
*/

