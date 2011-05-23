/* Author: 
*/


$(window).load(function(){
	//What a failure. Resize stuff.
	var bigCol = $("#mainRow .eightcol");
	var smallCol = $("#mainRow .fourcol");
	function resizeColumns(bigCol, smallCol)
	{
		$(bigCol).css('height', 'auto');
		$(smallCol).css('height', 'auto'); 

		if( !(isMedia("handheld, only screen and (max-width: 767px)"))) {
			var mainHeight = $("#mainRow").height();
			$(bigCol).height(mainHeight);
			$(smallCol).height(mainHeight); }
	};

	resizeColumns(bigCol, smallCol);
	$(window).resize(function()
		{
			resizeColumns(bigCol, smallCol);
			resizeSlideshow();

			//Increase size of slideshow if expanding outward
			var windowWidth = $(window).width();
			var oldWidth = $(window).data("oldWidth");
			if(windowWidth > oldWidth){
				$(slides).width($(slides).width() + ($(window).width() - $(window).data("oldWidth")));

				//Make other slides GTFO of the way. 
				$(slides).not(".activeSlide").css("left", "9999px");
			}
		});

	$("a.fancybox").fancybox({
		'overlayColor': '#4a686f',
		'overlayOpacity': .9,
	});

	//-----------------------------------------------------------
	// Slave slideshow for Home page
	//-----------------------------------------------------------
	//Add the markup and styles needed for this to happen.
	
	//Make sure all hidden screenshots are revealed.
	var screenshots = $("#screenshots");
	$(screenshots).css("position", "relative");
	$(screenshots).css("padding", 0);

	var slides = $(screenshots).children();
	var headline = $(screenshots).children().children("h1");
	resizeSlideshow();

	//Adjust the style to fit our needs!
	$(slides).css({
		position: "absolute",
		padding: "0px",
		top: "15px"
	});

	//Overwrite "auto" width with some god-damn voodoo
	$(slides).width($(slides).width());


	$(slides).fakeFloat({offset: 15, margin: 15});
	//Store original window width 
	$(window).data("oldWidth", $(window).width());
	
	//Resize the slideshow to simulate fluid movement.
	function resizeSlideshow(){
		var screenshots = $("#screenshots").add($("#screenshots").children());
		var slides = $(screenshots).children().children("img");
		var headline = $(screenshots).children().children("h1");

		$(slides).fakeFloat({offset: 15, margin: 15});

		/*
		 Preserve the value of Z, resize screenshot wrapper accordingly
		  ________________________________________
		  |                 |Z|                  |
		  |   --------------------------------   |
		  |   |                              |   |
		  |   |                              |   |
		  |_Z_| Y                            |_Z_| H
		  |   |                              |   |
		  |   |              X               |   |
		  |   --------------------------------   |
		  |_________________|Z|__________________|

						     W
			
		      X + 2Z = W 
					Y + 2Z = H
			  
	   */

		var x = $(slides).innerWidth();
		var y = $(slides).innerHeight();
		
		//Justin has a different border based on media query
		var z = 15; 
		if($(window).width() < 768){
			z = 5;
		}

		var w = $(screenshots).innerWidth();
		var h = $(screenshots).innerHeight();

		//Use image width to determine what media query we're at. Add extra height
		//if we're at small screens since text jumps down.
		var theHeight = y+2*z;
		var  theWidth = w-2*z;
		var headlineWidth = .45 * theWidth; //Provided in stylesheet

		if($(window).width() < 768){
			theHeight += 70;

			//If we're in the smaller browsers, we want the text to be
			//aligned center, so make the headline the width of its parent.
			headlineWidth = theWidth;
		}

		$(slides).width(theWidth);
		$(headline).width(headlineWidth);
		$(slides).fakeFloat({offset: 15, margin: 15});

		$(screenshots).height(theHeight);

	}

	
	$('#screenshots_wrapper').append('<div id="slideshow_nav"><ul><li class="slideNavActive">1</li><li>2</li><li>3</li></ul></div>');

	$("#screenshots").slaveshow({
		entrance: {speed: 1000},
		exit: {speed: 1000},
		transition: "fade",
		duration: 4000,
		offset: 15,
		margin: 15,
		nav: $("#slideshow_nav ul li")
	});

//=========================== Contact Page =============================//
//---------------------------------------------------------------------
// Form Validation
//---------------------------------------------------------------------
var form = new Form("#mail",
{
	hasNone:
	[
		  {id: $("#message"), types: "mailstrings,html,bbcode"}
	]
});
form.quickform();	

//Check for invalid on focusout
$(form.inputs()).focusout(function()
{
	//If empty and required or invalid, add invalid class
	if( form.invalid($(this)) || (!$(this).val() && $(this).hasClass(form.requiredClass())) )
	{
		$(this).addClass(form.invalidClass());
		$(this).parents("dd").prev().children().addClass(form.invalidClass());
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
			$(this).parents("dd").prev().children().removeClass(form.invalidClass());
		}
	}
});

form.onSend(function()
{
});

form.onClientInvalid(function(response)
{
	$(form.invalid()).addClass(form.invalidClass());
	$(form.invalid()).parents("dd").prev().children().addClass(form.invalidClass());
});

form.onSuccess(function()
{
	form.clear();
	$("#mail textarea").val("Your message has been sent. Thank you.");		
});

});

