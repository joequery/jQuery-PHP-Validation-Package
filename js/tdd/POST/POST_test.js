$(document).ready(function(){
var main = $("#main");

//Instantiate post
var post = new POST("ajax.php");

//Define the callback. Append the response to main div
post.callback(function(response){
	$(main).append("<br />");
	$(main).append(response);
});

//Set $_POST["key"] = wooohooo
post.set("key", "wooohoooo");

//Get the response from the server and trigger callback
post.getResponse();

//Overwrite the current "key" value
post.set("key", "number2!");

//Trigger the callback nad verify that "key" now has a different value.
post.getResponse();

}); //End document
