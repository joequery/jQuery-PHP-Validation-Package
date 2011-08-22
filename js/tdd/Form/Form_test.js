$(document).ready(function(){
	var form = new Form("#contact");

	form.is({
		 name: "name",
		email: "email",
		phone: "usphone"
	});

	form.hasNone({
		"message": "html, bbcode, mailstrings, int"
	});

	//Custom form behavior
	form.onClientInvalid(function(response){
		$(form.invalid()).addClass(form.invalidClass());
		$(form.invalid()).prev().addClass(form.invalidClass());
	});

	form.onSuccess(function()
	{
		form.clear();
		$("#contact textarea").val("Your message has been sent. Thank you.");		
		//$(form.invalidClass()).remove(form.invalidClass());
	});


	//Check for invalid on focusout
	$(form.inputs()).focusout(function()
	{
		//If empty and required or invalid, add invalid class
		if( form.invalid($(this)) || (!$(this).val() && $(this).hasClass(form.requiredClass())) )
		{
			$(this).addClass(form.invalidClass());
			$(this).prev().addClass(form.invalidClass());
		}
		else
		{
			$(this).removeClass(form.invalidClass());
			$(this).parents("dd").prev().children().removeClass(form.invalidClass());
		}
	});
		
	//If is currently invalid, check for correction each keystroke
	$(form.inputs()).keyup(function()
	{
		if( $(this).hasClass(form.invalidClass()) )
		{	
			if(form.valid($(this)))
			{
				$(this).removeClass(form.invalidClass());
				$(this).prev().removeClass(form.invalidClass());
			}
		}
	});

});
