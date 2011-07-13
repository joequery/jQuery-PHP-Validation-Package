/************************************************************/
//Class Regex
//Purpose: Easily evaluate common Regular Expression patterns
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
    name: "[-a-zA-Z0-9.'\\s]+",
    lastname: "([-a-zA-Z.'\\s]|[0-9](nd|rd|th))+",
	alphanum: "[a-zA-Z0-9]+"
    };
};

//Define default mods
Regex.mods = "";

//Transforms a comma delimited string into an array
Regex.getArray = function(str){
    //Get rid of blank spaces
    var str = str.replace(" ", "");
    
    return str.split(",");		
};
        
//Get the type from a string that may contain integers, or may not be
//lowercase.
Regex.getType = function(str){
    return str.toLowerCase().replace(/[^a-z]+/,"");    
};

//Returns the match result for an exact match
Regex.is = function(type, val, mods){
	//Check for mods
	mods = mods || Regex.mods

    //Make sure the type is formatted properly
    var pattern = Regex.pattern()[Regex.getType(type)];
    
    //Create regular expression object
    var re = new RegExp("^" + pattern + "$", mods);
    
    return re.test(val);
        
};

    //Returns the logical negation of Regex.is
    Regex.isNot = function(type,val, mods){
		//Check for mods
		mods = mods || Regex.mods

        return !Regex.is(type,val, mods);
    };

//Returns the match result for a match contained anywhere in the string
Regex.has = function(type, val, mods){
	//Check for mods
	mods = mods || Regex.mods

    //Make sure the type is formatted properly
    var pattern = Regex.pattern()[Regex.getType(type)];
    
    //Create regular expression object
    var re = new RegExp(pattern, mods);
    
    return re.test(val);        
};

    //Returns the logical negation of Regex.has
    Regex.hasNot = function(type,val, mods){
		//Check for mods
		mods = mods || Regex.mods

        return !Regex.has(type,val, mods);
    };

//Returns the match result for match options contained anywhere in the string
Regex.hasAny = function(types, val, mods){
	
	//Check for mods
	mods = mods || Regex.mods
	
    //Parse the string passed in for types
    var types = Regex.getArray(types);
    
    //Assume none are found
    var flag = false; 
    
    for(var i=0; i<types.length; i++){		
		//Make sure the type is formatted properly
		var type = Regex.getType(types[i]);
		
		if(Regex.has(type,val, mods)){
				flag = true;
		}		
    }
    
    return flag;
};

    //Returns the logical negation of Regex.hasAny
    Regex.hasNone = function(types, val, mods){
        return !Regex.hasAny(types,val, mods);
    };

Regex.nosubstr = function(flagArr, val){
	var flags = Regex.getArray(flagArr);
	
	// Flag: If none of the substrings are in the value.
	var nosubstr = true;

	for(var i=0; i<flags.length; i++){
		if(val.toLowerCase().search(flags[i].toLowerCase()) !== -1){
			nosubstr = false;
			break;
		}
	}

	return nosubstr;
};

//Export to node for local testing
if (typeof(window) === "undefined"){
	exports.Regex = Regex;
}

