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
