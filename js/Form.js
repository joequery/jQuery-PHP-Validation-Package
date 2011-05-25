/************************************************************/
//Class Form
//Purpose: Form validation and AJAX
//Dependencies: POST, Regex
//Parameters:
// id: The jQuery Object representing the form
// URL: The URL of the server file
// invalidClass: The invalid class that will be added to form items
//               That do not pass form validation.
// requiredClass:The class associated with required input fields
/************************************************************/
function Form(id,options){
    //------------------------------------------------------------
    // Set default property values
    //------------------------------------------------------------
    
    //Store a relatively global scope for convenience
    var form = this;
    
    //Initialize default values
    var defaults = {
        id: $(id),
        URL: $(id).attr("action"),
        invalidClass: "invalid",
        requiredClass: "required",
    };	settings = jQuery.extend(defaults,options);
    
	//Prevent default form behavior
	$(settings.id).submit(function(e){
		e.preventDefault();
	});
	
	//HasAny and HasNone: Arrays of fields with multiple criteria
	//for validation
	settings.hasNone = {};
	settings.hasAny = {};

	//Array of fields for exact matches
	settings.is = {};

	//Input fields
	settings.inputs = {};

	//Maps the input names to their type (is, hasAny, hasNone)
	settings.types = {};

    //Get setters and methods for the settings object.
	var gs = new GetSet();
    gs.getters({obj: settings, scope: form, prefix: "none"});
    gs.setters({obj: settings, scope: form});
     
    //------------------------------------------------------------
    //Define variables/functions for adding an AJAX string
    //------------------------------------------------------------
    var addAJAX = false;
    
    //=========================================================//
    //Pulic Method addAjax
    //Purpose: Concatenates a serialized post variable AJAX
    //Postcondition: var addAjax is set to true
    //=========================================================//
    form.addAJAX = function(){
        addAJAX = true;
    };
    
    //Allow user to force the form to invalid
    var forceInvalid = false;
    
    //=========================================================//
    //Public forceInvalid
    //Purpose: Allows user to force the form into an invalid state
    //Postcondition: forceInvalid altered
    //=========================================================//
    this.forceInvalid = function(){
        forceInvalid = true;
    };

    //=========================================================//
    //Private map_input
    //Purpose: maps input and adds to settings object
    //Postcondition: Settings.is altered
    //=========================================================//
	var map_input = function(name, type){
		settings.types[name] = type;

		//If inputs is empty, just make it the current field jqobject
		if(jQuery.isEmptyObject(settings.inputs)){
			settings.inputs = $("*[name='" +name+ "']");
		}
		else{
			settings.inputs = $(settings.inputs).add($("*[name='" +name+ "']"));
		}
	};

    //=========================================================//
    //Public rules
    //Purpose: Allows user to specify exact match rules for fields
    //Postcondition: Settings.is altered
    //=========================================================//
	this.is = function(obj){
		settings.is = obj;

		//Add each field key to the types object, of type "is"
		for (var i in obj){
			map_input(i, "is");
		}
	};

	
    //=========================================================//
    //Private addHas
    //Purpose: defines template function for addHasAny/addHasNone 
    //Postcondition: obj altered
    //=========================================================//
	var addHas = function(field, arrstr, obj){
		/*
		 * Perpare the array string.
		 *	Step 1: Remove all spaces
		 *	Step 2: string => array, delimited by comma
		 *
		*/
		arrstr = arrstr.replace(/\s/g, "");
		obj[field] = arrstr;
	};

    //=========================================================//
    //Public addHasAny
    //Purpose: Allows user to call a field valid if one pattern
	//		   matches
    //Postcondition: settings.hasAny altered
    //=========================================================//
	this.addHasAny = function(field, arrstr){
		addHas(field,arrstr, settings.hasAny);
		map_input(field, "hasAny");
	};

    //=========================================================//
    //Public addHasNone
    //Purpose: Allows user to call a field valid if one pattern
	//		   matches
    //Postcondition: settings.hasAny altered
    //=========================================================//
	this.addHasNone = function(field, arrstr){
		addHas(field,arrstr, settings.hasNone);
		map_input(field, "hasNone");
	};
    
    //=========================================================//
    //Public Method valid
    //Purpose: Validate a single item
    //Parameters:
    //  obj: The jQuery object of the item being tested
    //Postcondition: InvalidClass added to input if invalid
    //=========================================================//
    form.valid = function(obj){

        //ZOMG POLYMORPHIC RECURSION
		//If no object is passed to the valid method, the user wants to validate
		//the whole form.
		if(typeof obj === 'undefined'){	    
            //Invalid counter
            var invalidCount = 0;	    
            
			var counter = 0;
            $(settings.inputs).each(function(){
               if(form.invalid($(this)))
               {
                    invalidCount++;
               }
            });
            
            //Returning the negation of invalidCount causes a valid form
            //to return true
            return !invalidCount;
        }

        else {   
			//If the user has requested the form be forced invalid, return false.
			if(forceInvalid)
			{
				forceInvalid = false;
				return false;
			}

			//Get form attributes
			var value = $(obj).val();       
			var name = $(obj).attr('name'); 

			var valid;
			
			//Boolean: If the input is required
			var isRequired = $(obj).hasClass(settings.requiredClass);

            //If blank and required, return false. If blank and not required,
            //return true
            if(!value)
            {
                if(isRequired)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            
            //------------------------------------------------------------
            // If the value is not blank, proceed with these processes
			// Here we actually validate based on types
            //------------------------------------------------------------

			//Get type of validation (is, hasAny, hasNone);
			var type = settings.types[name];

            //Handle specific validation criteria
            if(type === "hasAny")
            {
                valid = Regex.hasAny(settings.hasAny[name], value);
            }
            else if(type === "hasNone")
            {
                valid = Regex.hasNone(settings.hasNone[name], value);
            }
            else
            {
                valid = Regex.is(settings.is[name], value);
            }
            
            return valid;
        }
    };
    
    //Create a copy of .valid for lingistic convenience. Some people may
    //prefer to call form.validate(input) for a specific item since the
    //verb "validate" implies an action.
    form.validate = form.valid;
    
    //Return the logical negation of form.validate. Also returns the jq objects
    //That correlate to it.
    form.invalid = function(obj){
        if(typeof obj === 'undefined'){
            //Will hold the jquery object with the invalid items
            var invalidObj = $();
            $(settings.inputs).each(function(){
                if( form.invalid($(this)) ){
                    invalidObj = $(invalidObj).add($(this));	    
                }
            });	    
            return invalidObj;
        }
        else
        {
            return !form.validate(obj);
        }
    };
    
    //=========================================================//
    //Public Method clear
    //Purpose: Clears the form of all input values
    //Postcondition: Form is cleared
    //=========================================================//
    form.clear = function(){
        jQuery(settings.id).find(':input')
                    .not(':button, :submit, :reset, :hidden')
                    .val('').removeAttr('checked')
                    .removeAttr('selected')
                    .removeClass(settings.invalidClass);
        jQuery(settings.id).find('textarea').val('');                                
		jQuery(settings.invalidClass).removeClass(settings.invalidClass);
    };    

        //------------------------------------------------------------
        //Define the potential messages back from the server
        //------------------------------------------------------------
        var Server = {};
        Server.successResponse = "thanks";
        Server.invalidResponse = "invalid";
        Server.errorResponse = "error";
        
        gs.getters({obj: Server, scope:form});
        gs.setters({obj: Server, scope:form});
	
        //-----------------------------------------------------------
        // Define Callback object to hold private callback methods 
        //-----------------------------------------------------------
        var Callback = {};
	
        Callback.success = function(){
            $("#confirmation").html("<h4>Your message was sent successfully.</h4>");
            form.clear();
        };
        
        Callback.serverInvalid = function(){
            $("#confirmation").html("<h4>Message not sent. Please verify your information.</h4>");            
        };
        
        Callback.clientInvalid = function(invalid){
            $("#confirmation").html("<h4>Please verify your information.</h4>");
            $(invalid).addClass(settings.invalidClass);
        };
        
        Callback.error = function(response){
            $("#confirmation").html("<h4>Server Error. Please try again.</h4>");            
        };
        
        Callback.submit = function(){
           $("#confirmation").html("<h4>Sending...</h4>"); 
        };
        
        //Function that decides which callback to execute based on server response.
        Callback.doCallback = function(response){
            if(response == Server.successResponse)
            {
                Callback.success();
            }
            
            else if(response == Server.invalidResponse)
            {
                Callback.serverInvalid();
            }
            
            else
            {
                Callback.error();                
            }            
        };
        
        //Define mutator methods for Callback. onSuccess, onInvalid
        gs.setters({obj: Callback, scope: form, prefix: "on"});
        
    //=========================================================//
    //Public Method mail
    //Purpose: Attempt to send mail and get response from server
    //Postcondition: Calls Callback.doCallback
    //=========================================================//
    form.mail = function(){	
        var post = new POST(settings.URL, function(response){
            Callback.doCallback(response);
        });
        
        //Serialize the form
        post.serialize(settings.id);
        
        //If developer requests to add AJAX value, append it to POST string
        if(addAJAX)
        {
            post.set("AJAX", "true");
        }
        
        post.getResponse();
    };
    
	/* 
	 * When the user submits the form, fire the callbacks. clientInvalid
	 * callback is fired if form does not validate, and the submit callback
	 * is fired if the form does validate. Add a variable named AJAX to the
	 * post array to process on the server, and send the mail!
	 */

	$(settings.id).submit(function(){
		//If the form is valid, mail it. If not, add the
		//invalid class to all invalid items.
		if(form.valid()){
			Callback.submit();
			
			//Add an AJAX post variable
			form.addAJAX();
			
			//Display a sending indicator
			form.mail();
		}

		else{
			Callback.clientInvalid($(form.invalid()));
		}
	});
}
