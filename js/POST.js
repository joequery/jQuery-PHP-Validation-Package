/************************************************************/
//Class POST
//Purpose: Easily communicate with server via POST
//Parameters:
//  url: The URL of the PHP file that will send a response
/************************************************************/
function POST(url, callback)
{            
    //Initialize empty string for field/value pairs
    var str = "";
        
    //=========================================================//
    //Public Method set
    //Purpose: Set's the value of a field
    //Parameters: 
    //  field: The field corresponding to the value. (Name, phone)
    //  val: The new value associated with the field
    //Postcondition: str is altered
    //=========================================================//
    this.set = function(field, val)
    {        
        //Check to see if this field already exists
        var re = new RegExp(field + "=[a-zA-Z0-9%+.!$()_+*'-]*");        
        var match = re.exec(str);
        
        //If this field is set, overwrite the value
        if(match)
        {            
            str = str.replace(match, field + "=" + val);
        }
        
        //If not, append the string with the value
        else
        {
            //Check if an & is at the end of str.
            //If not, add one if this isn't the beginning of the string.            
            if( (str.length > 0) && (str.substr(-1) != "&") )
            {
                str += "&";
            }
            
            str += (field + "=" + val);
        }
    };
    
    //=========================================================//
    //Public callback
    //Purpose: Set callback function
    //Parameters:
    //  func: The new callback function
    //Postcondition: callback is altered
    //=========================================================//
    this.callback = function(func)
    {
        callback = func;
    };
    
    //=========================================================//
    //Public serialize
    //Purpose: Serves as a wrapper for jQuery serialize. 
    //Parameters:
    //  form: jQuery selector of the form to be serialized.
    //Postcondition: str is appended with seralized form sring
    //=========================================================//
    this.serialize = function(form)
    {
        str += ($(form).serialize());
    };
    
    //=========================================================//
    //Method getResponse
    //Purpose: Get a string response from the server
    //Postcondition: Returns a string
    //=========================================================//
    this.getResponse = function()
    {                  
        //Make sure appropriate values are set
        if( isset(url) && isset(str) && isset(callback) )
        {
            jQuery.ajax(
            {
                type: "POST",
                url: url,
                data: str,
                success: function(msg)
                {
                    callback(msg);
                },
                error: function(msg)
                {
                    callback(msg);
                }
            });            
        }
    };
}
