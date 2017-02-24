console.log("connected");
var imagesToFilter = document.querySelectorAll("#lightgallery .imagesToFilter");
var checkBoxes = document.querySelectorAll("#filterModal .checkbox label input");

// setup click event handlers on filter checkboxes
for (var i = 0; i < checkBoxes.length; i++) {
	checkBoxes[i].addEventListener("click", filterImages , false);
	checkBoxes[i].checked = true;
}

// click event handler function
function filterImages(e) {
 	var clickedItem = e.target;
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
	var flag;
	var nextImageFlag;
	for (i = 0; i < imagesToFilter.length; i++) {
		var currentItem = imagesToFilter[i];

		// look at all tags of image, tags are of Object String
		var imageTagsString = currentItem.getAttribute("data-type");
		console.log(Object.prototype.toString.call(imageTagsString));
		var imageTags = imageTagsString.split(",");
		console.log(Object.prototype.toString.call(imageTags));
		console.log("Image " + i + "Tags : " + imageTags);
		for (j = 0; j < imageTags.length; j++) {
		   // if tag matches the checkboxed value ignore
		   console.log("Iterating on Tag : " + imageTags[j]);
		   if (imageTags[j] == itemType) {
		      // if tag is only tag on image then hide/show
		      if (imageTags.length == 1) {
		         // set flag = true to hide/show
			 console.log("True, hide/show");
			 flag = true;
		      }
		      else {
		         console.log("continuing on tag" + imageTags[j]);
		         continue;
		      }
		   }
		   else {
 		      // check if the tag is checked in any other checkbox
		      //console.log("Num Checkboxes : " + checkBoxes.length);
		      for (k = 0; k < checkBoxes.length; k++) {
		         // if box is checked with an image tag don't hide/show
			 // and just break onto next image
			 if (checkBoxes[k].getAttribute("data-type") ==
					 imageTags[j] && checkBoxes[k].checked
					 == true) {
			    console.log("Other filter is applied! Filter : " +
					    checkBoxes[k].getAttribute("data-type") + ". Image Tags : " +
					    imageTags[j]);
			    flag = false;
			    // if satisfied by another filter use flag
			    // to break out into next image
			    nextImageFlag = true;
			    break;
			 }
			 else {
		            // if no other checkbox filter tag matches image
			    console.log("No other tags match filter! Hide/show!");
			    flag = true;
			 }
		      }
		   }
		   // break out of looping through other tags and into next
		   // image. reset flag for next loops
		   if (nextImageFlag) {
		      nextImageFlag = false;
		      break;
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



