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
});
