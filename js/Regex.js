/************************************************************/
//Class Regex
//Purpose: Static entity for evaluating common regex patterns.
//
//Note the use of anonymous functions around the pattern and
//descrption properties to keep them private.
/************************************************************/
var Regex = {}; //Object instead of function for static effect

//Define regex patterns.
Regex.pattern = function(){
    return {
    int: "\\d+",
    float: "\\d*\\.\\d+",
    mailstrings: "(content\\-type|mime\\-version|multipart\\/mixed|Content\\-Transfer\\-Encoding|bcc|cc|to|headers):",
    email: "[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}",
    html: "<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>.*?<\\/\\1>",
    url: "([-a-z0-9+.]*(:|:\\/\\/))?([\\w_-]+\\.)+[a-zA-Z]{2,}[-%\\$_.+!*'(),;\\/?:@=&\\w#]*",
    zip: "^((\\d{5}-\\d{4})|(\\d{5})|([A-Z]\\d[A-Z]\\s\\d[A-Z]\\d))",
    alpha: "[a-zA-Z]+",
    num: "\\d+",
    bbcode: "\\[([a-zA-Z][a-zA-Z0-9]*)\\b[^\\]]*\\].*?\\[\\/\\1\\]",
    usphone: "(1\\s*[-\\/\\.]?)?(\\((\\d{3})\\)|(\\d{3}))\\s*[-\\/\\.]?\\s*(\\d{3})\\s*[-\\/\\.]?\\s*(\\d{4})\\s*(([xX]|[eE][xX][tT])[-.:]?\\s*(\\d+))*",
    usaddress: "\\d+\\s[-\\w.,\\s#:]+",
    fullname: "[a-zA-Z]+\\s+([-a-zA-Z.'\\s]|[0-9](nd|rd|th))+",
    name: "[-a-zA-Z.'\\s]+",
    lastname: "([-a-zA-Z.'\\s]|[0-9](nd|rd|th))+"
    };
};

//Define the descriptions as they will appear in emails or response text
Regex.description = function() {    
    return {
    int: "Integer",
    float: "Float",
    mailstrings: "Mail Strings",
    email: "Email",
    html: "HTML",
    url: "URL",
    zip: "Zip Code",
    alpha: "Alphabetic Character",
    num: "Number",
    bbcode: "BB Code",
    usphone: "Phone",
    usaddress: "Address",
    name: "Name",
    fullname: "Name",
    lastname: "Last Name",
    message: "Message"
    };
};

Regex.example = function() {
    return {
    name: "John Doe",
    usphone: "903-555-5555",
    email: "myemail@gmail.com",
    html: "<b>HTML</b>",
    url: "www.vertstudios.com",
    zip: "75701",
    alpha: "abcdefg",
    num: "99095",
    bbcode: "[B]BBCODE[/B]",
    usaddress: "1800 East Barbara Street",
    fullname: "John Doe",
    lastname: "Doe 2nd",
    int: "111",
    float: "111.50",
    mailstrings: "to:bcc:",
    message: "No HTML or BB Code."
    };
};

//Returns the match result for an exact match
Regex.is = function(type, val)
{
    //Make sure the type is formatted properly
    type = Regex.getType(type);		
    
    pattern = Regex.pattern()[type];
    
    //Create regular expression object
    var re = new RegExp("^" + pattern + "$");
    
    return re.test(val);
        
};

    //Returns the logical negation of Regex.is
    Regex.isNot = function(type,val)
    {
        return !Regex.is(type,val);
    };

//Returns the match result for a match contained anywhere in the string
Regex.has = function(type, val)
{
    //Make sure the type is formatted properly
    type = Regex.getType(type);		
    
    pattern = Regex.pattern()[type];
    
    //Create regular expression object
    var re = new RegExp(pattern);
    
    return re.test(val);        
};

    //Returns the logical negation of Regex.has
    Regex.hasNot = function(type,val)
    {
        return !Regex.has(type,val);
    };

//Returns the match result for match options contained anywhere in the string
Regex.hasAny = function(types, val)
{
    //Parse the string passed in for types
    types = Regex.getArray(types);
    
    //Assume none are found
    var flag = false; 
    
    for(var i=0; i<types.length; i++)
    {		
            //Make sure the type is formatted properly
            type = Regex.getType(types[i]);
            
            
            if(Regex.has(type,val))
            {
                    flag = true;
            }		
    }
    
    return flag;
};

    //Returns the logical negation of Regex.hasAny
    Regex.hasNone = function(types, val)
    {
        return !Regex.hasAny(types,val);
    };
//Get the text description of a validation type
Regex.getDescription = function(type)
{
    //Make sure the type is formatted properly. Return the description.
    type = Regex.getType(type);
    
    return Regex.description()[type];
};

//Get the text example of a validation type
Regex.getExample = function(type)
{
    //Make sure the type is formatted properly. Return the description.
    type = Regex.getType(type);
    
    return Regex.example()[type];
};
        
//Transforms a comma delimited string into an array
Regex.getArray = function(str)
{
    //Get rid of blank spaces
    str = str.replace(" ", "");
    
    return str.split(",");		
};

//Get the type from a string that may contain integers, or may not be
//lowercase.
Regex.getType = function(str)
{
    return str.toLowerCase().replace(/[^a-z]+/,"");    
};
