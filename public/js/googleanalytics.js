
$(document).ready(function() {
	initializePage();
});

function initializePage() {
	$("#shareBtn").click(function () {
   		ga("send", "event", "shareBtn", "click");
	});

  	$("#shareBtnB").click(function () {
        	ga("send", "event", "shareBtnB", "click");
	});

	$("#voiceBtn").click(function () {
 		ga("send", "event", "voiceBtn", "click");
	});

	$("#voiceBtnB").click(function () {
		ga("send", "event", "voiceBtnB", "click");
	});


}
