console.log("stt connected");
//console.log("output says: " + document.getElementById("STToutput").innerHTML);
// get accessToken to use with API calls
var accessToken;
var wavFile;

getToken();
console.log("got token" + Object.prototype.toString.call(accessToken));

/*
$.get("voice/whatstheweatherlike.wav", function(data) {
       wavFile = data;
       //console.log("got .wav, length(bytesize) :" + wavFile.length );
  }
);*/

$("#voice").click(clearText());
$("#voiceRecordBtn").click(start);

// helper functions to display speech api results and parse them
function setText(text) {
      console.log(text);
      console.log(Object.prototype.toString.call(text));
      var display = text[0].display;
      console.log(display);
      document.getElementById("STToutput").innerHTML += ("You said: " + display);
      parseSTT(text);
};

function clearText() {
      document.getElementById("STToutput").innerHTML = "";
};

function parseSTT(text) {
     var lexical = text[0].lexical;
     // will locate index position of tag and tags
     var pos = lexical.indexOf("tag");
     if(pos > -1) {
	// this slice includes the tag, so also shift() tag
        var tags = lexical.slice(pos, lexical.length);
	//console.log(tags);
	var tagsArray = tags.split(" ");
	//console.log(tagsArray);
	tagsArray.shift();
  var tagObject = {'values': tagsArray};

	// now use tagsArray on the filter checkBoxes
	// function from filterHelper.js
        filterImagesVoice(tagObject);
     }
     else {
         document.getElementById("STToutput").innerHTML += ("\n" + "I am sorry I could not understand you. Please try again with 'add tags ...'.");
     }

};

// the speech to text through microphone use
function start () {
   var mode = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase; 
   var key = "23716c807f6447acb186e2590a43cff3";
   var language = "en-us";
   var client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(mode, language, key);

   clearText();
   console.log("mic starting");
   client.startMicAndRecognition();
   setTimeout(function () {
      console.log("begin timeout to end mic");
      client.endMicAndRecognition();
      console.log("mic ended");
   }, 5000);

   client.onPartialResponseReceived = function (response) {
      console.log("response recieved");
      console.log(response);
      setText(response);
   }

   client.onFinalResponseReceived = function (response) {
      console.log("final response recieved");
      //setText(JSON.stringify(response));
      setText(response);
   }

   client.onIntentReceived = function (response) {
      setText(response);
   };   
}

function test() {
      speechToText(accessToken, function(err, res) {
         if(err) return console.log(err);
	 console.log(res.results[0].lexical);
      });
}

function speechToText(token, callback) {
   console.log("voice btn clicked");

   var params = {
	"scenarios": "ulm",
	"appID": "D4D52672-91D7-4C74-8AD8-42B1D98141A5",
	"locale": "en-US",
	"device.os": "wp7",
	"version": "3.0",	
	"format": "json",
	"requestid": "b2c95ede-97eb-4c88-81e4-80f32d6aee54",
	"instanceid": "b2c95ede-97eb-4c88-81e4-80f32d6aee54"
   };

   var ex = ("https://speech.platform.bing.com/recognize?" + $.param(params));
   console.log("url: " + ex);
   console.log(token);

   $.ajax({url: "https://speech.platform.bing.com/recognize?" + $.param(params),
	   beforeSend: function(xhrObj) {
              //request headers
	      //xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "23716c807f6447acb186e2590a43cff3");
	      xhrObj.setRequestHeader("Authorization", "Bearer " + token);
	      xhrObj.setRequestHeader("Content-Type", "audio/wav; samplerate=16000");
	   },
          type: "POST",
	  // request body
	  data: wavFile})
	  .done(function(data) {
  	     console.log(data);
	     console.log("stt success");
	  })
          .fail(function() {
             alert("failure");
	  });
}

// generate token and assign accessToken to generated token
function getToken() {
        var params = {
            // Request parameters
        };
      
        $.ajax({
            url: "https://api.cognitive.microsoft.com/sts/v1.0/issueToken?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                //xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","23716c807f6447acb186e2590a43cff3");
            },
            type: "POST",
            // Request body
            //data: "{body}",
        })
        .done(function(data) {
	    //console.log(data);
	    //console.log(Object.prototype.toString.call(data));
	    accessToken = data;
            //alert("success");
        })
        .fail(function() {
            alert("error");
        });
    };
