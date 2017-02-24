
// Shows thumbnail of selected images
$("#file-select").change(function(e) {
 function initOnReaderLoaded(img, reader){
    return function(){
        img.src = reader.result;
    }
 }
 for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

    var file = e.originalEvent.srcElement.files[i];


     var div = document.createElement("div");
     div.id = i;
     div.className = "col-xs-4 topPadding";
     var img = document.createElement("img");
     img.className = "img-responsive";
     //div.className = "picContainer";
     var reader = new FileReader();
     reader.onloadend = initOnReaderLoaded(img, reader);
     reader.readAsDataURL(file);
     div.appendChild(img);
     if (i==0){
        $("input").after(div);
     }
     else{
        $("#" + (i-1)).after(div);
     }
     //$("input").after(div);
     //var container = document.getElementById("images-container");
     //container.appendChild(div);
} });

// Handles Vision and Face API Logic
function categorize() {
    var params = {
        // Request parameters
    };

    var filething = document.getElementById('file-select').files[0];

    // Get image tags with vision API
    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/tag?" + $.param(params),
        beforeSend: function(xhrObj){
                // Request headers
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a4b21213a6ff49a991c1fdc5d0699d70");
        },
            type: "POST",
            processData: false,
            // Request body
            data: filething//makeblob( URL.createObjectURL(filething))
        })
        .done(function(data) {
            var htmlData ='';
            for (var i = 0; i < data["tags"].length; i++){
                if (i == data["tags"].length-1){
                    htmlData += data["tags"][i].name+ ', ';
                }
                else{
                    htmlData += data["tags"][i].name + ', ';
                }
            }
            htmlData += '</p>';
            //$('#uploadModal').modal('show'); 
            //alert(JSON.stringify(data["tags"]));
            $("#getCode").append(htmlData);
            $("#getCodeModal").modal('show');
        })
        .fail(function() {
            alert("Error creating tags");
        });

    // Detect Faces and Identify if possible
    var a1 = $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a901709024084f4593133346ffc04c2c");
            },
            type: "POST",
            processData: false,
            // Request body
            data: filething,
         }),
    a2 = a1.then(function(data) {
            var input = {
                "personGroupId":"team5",
                "faceIds":[],
                "maxNumOfCandidatesReturned":1,
                "confidenceThreshold": 0.5
            };
            if (data.length == 0){
                console.log("No faces detected");
                $("#getCode").append("<p>No faces could be detected</p>");
                return;
            }
            for (var i = 0; i < data.length; i++){
                input['faceIds'].push(data[i].faceId);
            }
            var inputString = JSON.stringify(input);

             // .then() returns a new promise
            if (data != null) {
             return $.ajax({
                 url: "https://westus.api.cognitive.microsoft.com/face/v1.0/identify?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a901709024084f4593133346ffc04c2c");
            },
            type: "POST",
            // Request body
            data: inputString,
        })}
        });

    a2.done(function(data) {
        var person = [];
        console.log("data");
        for (var i = 0; i < data.length; i++){
            if (data[i].candidates.length){
                person.push(data[i].candidates[0].personId);
            }
        }
        var htmlPerson = "<p>We found ";
        if (person.length==0){
            htmlPerson += "no known faces in this photo</p>";
            $("#getCode").append("<p>All faces in photo are unknown</p>");
            console.log("No Faces Identified");
        }
        else {
            //$("#getCode").append("<p>We found ");
            for (var i = 0; i < person.length; i++){
                $.ajax({
                    url: "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/team5/persons/" + person[i] + "?" + $.param(params),
                    beforeSend: function(xhrObj){
                    // Request headers
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a901709024084f4593133346ffc04c2c");
                    },
                    type: "GET"//,
                    // Request body
                    //data: ,
                })
                .done(function(data) {
                    //htmlPerson += data["name"]; 
                    /*if (i == person.length-1){
                        htmlPerson += " in this photo</p>";
                    }*/
                    $("#getCode").append(data["name"] + ", ");
                    $("#getCodeModal").modal('show');
                    console.log(htmlPerson);
                })
                .fail(function() {
                    console.log("Identify Failed");
                });
                }
            }
            
            //$("#getCodeModal").modal('show');
        });
}

