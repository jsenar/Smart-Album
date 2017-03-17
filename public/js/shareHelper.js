console.log("shareHelper.js connected");
//share the filtered images to an email
//var images = document.querySelectorAll("a.pig-figure");
// first get the filtered pictures
var imageURLS = "";

$("#shareBtn").click(picturesToShare);
$("#applyShare").click(sendMail);
$("#confirmShare").click(hideModal);

// share all pictures currently showing
function picturesToShare() {

   clearImageURLS();
   var images = document.querySelectorAll("a.pig-figure");
   for (var i = 0; i < images.length; i++) {
      imageURLS += ("\n\n" + images[i].getAttribute("src"));
   }
   console.log("sharing these images :" + imageURLS);
}

function clearImageURLS() {
   images = "";
   imageURLS = "";
}

function sendMail() {
   
   var user = document.querySelectorAll("#email");  
   var subject = document.querySelectorAll("#subject");
   var message = document.querySelectorAll("#message");
   console.log(Object.prototype.toString.call(user[0].value));
   console.log(subject[0].value);
   console.log(user[0].getAttribute("value"));
   var link = "mailto:" + escape(user[0].value) + "?subject=" +
	   escape(subject[0].value) + "&body=" + escape(message[0].value +
			   "\n") + escape(imageURLS);

   console.log(link);
   var send = document.querySelectorAll("#confirmShare");
   console.log(send[0].getAttribute("href"));
   send[0].setAttribute("href", link);
   console.log(send[0].getAttribute("href"));

   send[0].setAttribute("style", "color: #0f0");

}

function hideModal() {
   var modal = document.querySelector("#shareModal");
   modal.modal("hide");
}

