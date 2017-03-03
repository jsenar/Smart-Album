console.log("filterhelper connected");
var imagesToFilter = document.querySelectorAll("#lightgallery .imagesToFilter");
var checkBoxes = document.querySelectorAll("#filterModal .checkbox label input");
var tags = taggle.getTags();
console.log(taggle.getTags());
console.log(data);

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// define what element should be observed by the observer
// and what types of mutations trigger the callback
var target = document.getElementByClassName("taggle_list");

var observer = new MutationObserver(
	function(mutations) {
		searchTags();
});
 
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };
 
// pass in the target node, as well as the observer options
observer.observe(target, config);

// setup click event handlers on filter checkboxes
for (var i = 0; i < checkBoxes.length; i++) {
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



