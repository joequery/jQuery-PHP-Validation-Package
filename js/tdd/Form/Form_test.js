$(document).ready(function(){
	var form = new Form("#contact", 
	{

	});

	form.is({
		 name: "alphanum",
		email: "email",
		phone: "usphone",
	});

	form.addHasNone("message", "html, bbcode, mailstrings");
	form.quickform();

	form.onClientInvalid(function(response){
		$(form.invalid()).addClass(form.invalidClass());
		$(form.invalid()).prev().addClass(form.invalidClass());
	});

	form.onSuccess(function()
	{
		form.clear();
		$("#contact textarea").val("Your message has been sent. Thank you.");		
	});
});
