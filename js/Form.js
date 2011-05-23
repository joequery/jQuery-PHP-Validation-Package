/************************************************************/
//Class Form
//Purpose: Form validation and AJAX
//Dependencies: POST, Regex
//Parameters:
// id: The jQuery Object representing the form
// URL: The URL of the server file
// hasAny: Any form values that will be subject to a hasAny
//         test should go here. Takes the form
//         {id, types}
// hasNone: Same concept as hasAny, but for a hasNone test.
// invalidClass: The invalid class that will be added to form items
//               That do not pass form validation.
// requiredClass:The class associated with required input fields
/************************************************************/
function Form(id,options)
{
    //------------------------------------------------------------
    // Set default property values
    //------------------------------------------------------------
    
    //Get default form
    id = (typeof id === 'undefined') ? $("form") : id;
    
    //Store a relatively global scope for convenience
    var form = this;
    
    //Initialize default values
    var defaults = {
        id: $(id),
        URL: $(id).attr("action"),
        hasAny: null,
	hasNone: null,
        invalidClass: "invalid",
        requiredClass: "required",
        inputs: $(id).find('input[type="text"], textarea')
    };	settings = jQuery.extend(defaults,options);
    
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
    form.addAJAX = function()
    {
        addAJAX = true;
    };
    
    //Allow user to force the form to invalid
    var forceInvalid = false;
    
    //=========================================================//
    //Public forceInvalid
    //Purpose: Allows user to force the form into an invalid state
    //Postcondition: forceInvalid altered
    //=========================================================//
    this.forceInvalid = function()
    {
        forceInvalid = true;
    };
    
    //=========================================================//
    //Public Method valid
    //Purpose: Validate a single item
    //Parameters:
    //  obj: The jQuery object of the item being tested
    //Postcondition: InvalidClass added to input if invalid
    //=========================================================//
    form.valid = function(obj)
    {
        //Get form attributes
        var value = $(obj).val();       
        var name = $(obj).attr('name'); 
        var valid;
        
        //Boolean: If the input is required
        var isRequired = $(obj).hasClass(settings.requiredClass);
        
        //If the user has requested the form be forced invalid, return false.
        if(forceInvalid)
        {
            forceInvalid = false;
            return false;
        }
        
        //ZOMG RECURSIVE POLYMORPHISM!
        if(typeof obj === 'undefined')
        {	    
            //Invalid counter
            var invalidCount = 0;	    
            
            $(settings.inputs).each(function()	       
            {
               if(form.invalid($(this)))
               {
                    invalidCount++;
               }
            });
            
            //Returning the negation of invalidCount causes a valid form
            //to return true
            return !invalidCount;
        }
        
        else
        {   
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
            //If the value is not blank, proceed with these processes
            //------------------------------------------------------------
            
            //Check to see if this item is included in the "HasAny" pseudo-array
            var hasAnyTypes = false;
            if(isset(settings.hasAny))
            {	
                for(var i=0; i<settings.hasAny.length; i++)
                {
                    if($(obj).equalTo($(settings.hasAny[i].id)))
                    {
                        //store the types
                        hasAnyTypes = settings.hasAny[i].types;
                    }            
                }
            }
            
            //Repeat the process for the HasNone psuedo-array
            var hasNoneTypes = false;
            if(isset(settings.hasNone))
            {
                for(var i=0; i<settings.hasNone.length; i++)
                {
                    if($(obj).equalTo($(settings.hasNone[i].id)))
                    {
                        //store the types
                        hasNoneTypes = settings.hasNone[i].types;
                    }            
                }
            }	
            
            //Handle specific validation criteria
            if(hasAnyTypes)
            {
                valid = Regex.hasAny(hasAnyTypes, value);
            }
            else if(hasNoneTypes)
            {
                valid = Regex.hasNone(hasNoneTypes, value);
            }
            else
            {
                valid = Regex.is(name, value);
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
    form.invalid = function(obj)
    {
        if(typeof obj === 'undefined')
        {
            //Will hold the jquery object with the invalid items
            var invalidObj = $();
            $(settings.inputs).each(function()
            {
                if( form.invalid($(this)) )
                {
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
    form.clear = function()
    {
        jQuery(settings.id).find(':input')
                    .not(':button, :submit, :reset, :hidden')
                    .val('').removeAttr('checked')
                    .removeAttr('selected')
                    .removeClass(settings.invalidClass);
        jQuery(settings.id).find('textarea').val('');                                
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
	
        Callback.success = function()
        {
            $("#confirmation").html("<h4>Your message was sent successfully.</h4>");
            form.clear();
        };
        
        Callback.serverInvalid = function()
        {
            $("#confirmation").html("<h4>Message not sent. Please verify your information.</h4>");            
        };
        
        Callback.clientInvalid = function(invalid)
        {
            $("#confirmation").html("<h4>Please verify your information.</h4>");
            $(invalid).addClass(settings.invalidClass);
        };
        
        Callback.error = function(response)
        {
            $("#confirmation").html("<h4>Server Error. Please try again.</h4>");            
        };
        
        Callback.send = function()
        {
           $("#confirmation").html("<h4>Sending...</h4>"); 
        };
        
        //Function that decides which callback to execute based on server response.
        Callback.doCallback = function(response)
        {
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
    form.mail = function()
    {	
        var post = new POST(settings.URL, function(response)
        {
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
    
    //=========================================================//
    //Public Method quickform
    //Purpose: Provide an easy form send for lazy designers that
    //         probably shouldn't be using jQuery. :P #owned
    //Postcondition: Invalid class added or form is mailed with
    //               the appropriate callback message.
    //=========================================================//
    form.quickform = function()
    {
        $(settings.id).submit(function()
        {
            //If the form is valid, mail it. If not, add the
            //invalid class to all invalid items.
            if(form.valid())
            {
                Callback.send();
                
                //Add an AJAX post variable
                form.addAJAX();
                
                //Display a sending indicator
                form.mail();
            }
            else
            {
                Callback.clientInvalid($(form.invalid()));
            }
            
            return false; //Override default form behavior
        });
    };
}
