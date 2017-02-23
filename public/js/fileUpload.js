

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

function categorize() {
        var params = {
            // Request parameters
        };

        var filething = document.getElementById('file-select').files[0];


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
            console.log("coolio");
        })
        .fail(function() {
            alert("Error creating tags");
        });
    }

