<?php
date_default_timezone_set('America/Chicago');
//---------------------------------------------------------rrr
// File: Mail.php
// Purpose: Vert Studios Regex Class
// Author: Joseph McCullough (@joe_query) 
// Last Updated: Dec 03, 2010
//------------------------------------------------------------
class Mail
{
	private $body;    //Email body
	private $headers; //Email headers
	private $to;      //Those who will receive the email
	private $from;    //Who the email will appear to come from
	private $subject; //The subject of the email
	private $domain;  //The domain of the current site
	private $required;//Required form fields
	private $special; //Fields that require specific validation
	private $postArr; //Array that contains the POST values
	private $hasAny;  //Array that holds hasAny validation requirements
	private $hasNone; //Array that holds hasNone validation requirements
	private $customDescriptions;  //Array that holds custom descriptions
	private $appendOrder; //Array that describes order of appending.
	private $field_value_pairs; //Array with initial field/value pairs	
	//Constructor
	//$to: Who the email will be sent to
	//$arr: Array containing the POST values
	public function Mail($to, $arr)
	{		
		//Unset the "submit" key that will be sent if <input type="submit 
		//is used in the contact form.
		if( isset($arr["submit"]) ){
			unset($arr["submit"]);
		}
		
		//------------------------------------------------------------
		//Initialize variables
		//------------------------------------------------------------
		$this->postArr = $arr;
		$this->field_value_pairs = $arr;
		$this->required = array();
		$this->special = array();
		$this->hasAny = array();
		$this->hasNone = array();
		$this->customDescriptions = array();	
		$this->body = "";
		$this->to = $to;
		$this->appendOrder = array();
				
	}
	
	//------------------------------------------------------------
	//		        Accessor Methods
	//------------------------------------------------------------
	
	//Returns the email body
	public function getBody()
	{
		return $this->body;
	}
	
	//------------------------------------------------------------
	// 			Mutation Methods
	//------------------------------------------------------------
	
	//Set what email address the email appears to be from
	public function setFrom($str)
	{
		$this->from = $str;

		//Construct initial headers
		$this->headers = 'From:' . $this->from . "\r\n" . 'X-Mailer: PHP/' . phpversion() . "\r\n";
	}
	
	//Create a mutator method for required
	//$str: comma delimited string
	public function setRequired($str)
	{
		//Define a special keyword "all" to make all fields required
		if(strtolower($str) == "all")
		{
			$newstr = "";
			foreach($this->postArr as $field => $value)
			{
				$newstr .= $field . ",";
			}
			//Trim trailing comma
			$newstr = substr($newstr, 0, -1);
			
			$this->required = Regex::getArray($newstr);	
		}
		else
		{
			$this->required = Regex::getArray($str);	
		}	
	}
		
	//Allow specified order of appendage
	public function setOrder($arr)
	{
		$this->appendOrder = $arr;
	}

	//Create a mutator method for the subject
	public function setSubject($str)
	{
		$this->subject = $str;
	}

	public function setDesc($arr)
	{
		$this->customDescriptions = $arr;
	}
	
	public function addHasAny($field, $types, $description)
	{		
		$this->hasAny[] = array("field" => $field,
					"types" => $types,
					"description" => $description,
					"value" => $this->postArr[$field]);
	}
	
	public function addHasNone($field, $types, $description)
	{	
		$this->hasNone[] = array("field" => $field,
					"types" => $types,
					"description" => $description,
					"value" => $this->postArr[$field]);
	}	

	//------------------------------------------------------------
	//			Validation Methods
	//------------------------------------------------------------
	
	//See if an AJAX value was specifed in an arrray. If yes, return
	//true and unset. If not, return false
	public function hasAJAX()
	{
		//Flag for if an ajax field is found in the array
		$hasAJAX = false;
		
		//Look through fields for ajax
		foreach($this->postArr as $field => $value)
		{
			if( strtolower($field) == "ajax" )
			{
				$hasAJAX = true;
				unset($this->postArr[$field]);
				break;
			}
		}
		
		return  $hasAJAX;
	}	
		
	
	//Validate all the fields in the array after hasAny and hasNone
	//have been set and removed
	public function validateIs()
	{
		//Convenience variable
		$arr = $this->postArr;	
		
		//Boolean flag representing validity
		$valid = true;
		
		foreach($arr as $field => $value)
		{
			
			if(!(Regex::is($field,$value)) && (!empty($value) && !in_array($field, $this->required ) ))
			{
				$valid = false;
				break;
			}
		}
		return $valid;
	}
	
	//Validate the hasAny fields
	public function validateHasAny()
	{
		//Convenience variable
		$arr = $this->hasAny;		
		
		//Boolean flag representing validity
		$valid = true;
		
		//Check through hasAny array for invalid items
		for($i=0; $i<sizeof($arr); $i++)
		{
			if(! (Regex::hasAny($arr[$i]["types"], $arr[$i]["value"])) )
			{
				$valid = false;
				break;
			}
			else
			{
				//Take this field out of the primary array
				unset($this->postArr[ $arr[$i]["field"] ]);
			}
		}
		return $valid;		
	}
	
	//Validate the hasNone fields
	public function validateHasNone()
	{
		//Convenience variable
		$arr = $this->hasNone;
				
		//Boolean flag representing validity
		$valid = true;
		
		//Check through hasNone array for invalid items
		for($i=0; $i<sizeof($arr); $i++)
		{
			if(! (Regex::hasNone($arr[$i]["types"], $arr[$i]["value"])) )
			{
				$valid = false;
				break;
			}
			else
			{
				//Take this field out of the primary array
				unset($this->postArr[ $arr[$i]["field"] ]);
			}
		}
		return $valid;		
	}
	
	//Validate hasAny, hasNone, and normal fields
	public function valid()
	{
		$valid = false;
		
		//If all are valid, and all required fields are
		//not empty, set $valid to true
		if
		(
			$this->validateHasAny() &&
			$this->validateHasNone() &&
			$this->validateIs()			
		)
		{
			$valid = true;	
		}		
		return $valid;		
	}
	
	
	//------------------------------------------------------------
	//			   Email Methods
	//------------------------------------------------------------
	
	//Append a field/value pair to the email body
	public function append($field, $value)
	{
		$this->body .= $field . ": " . $value . "\n";
	}
	
	//Append a string to the email body with a trailing new line.
	public function println($str = "\n")
	{
		$this->body .= $str . "\n";
	}
			
	//Attempt to send mail. Return the boolean result
	public function send()
	{
		return mail($this->to, $this->subject, $this->body, $this->headers);
	}
	
	//Append all fields and values to the email body
	public function appendAll()
	{
		//Prepare to use an array for pushing field:value pairs
		$form = array();
		
		//Go through validateIs()
		foreach($this->postArr as $field => $value)
		{
			if(isset($this->customDescriptions[$field])) {
				$description = $this->customDescriptions[$field]; }
			else {
				$description = Regex::getDescription($field); }
			$form[$field] = array($description, $value);
		}
		
		//Go through validateHasAny()
		for($i=0; $i<sizeof($this->hasAny); $i++)
		{
			$field = $this->hasAny[$i]["field"];
			$description = $this->hasAny[$i]["description"];
			$value = $this->hasAny[$i]["value"];
			//$form[$description] = $value;
			$form[$field] = array($description, $value);
		}
		
		//Go through validateHasNone()
		for($i=0; $i<sizeof($this->hasNone); $i++)
		{
			$field = $this->hasNone[$i]["field"];
			$description = $this->hasNone[$i]["description"];
			$value = $this->hasNone[$i]["value"];
			//$form[$description] = $value;
			$form[$field] = array($description, $value);
		}		

		//If an append order is specified, sort it.
		if(!empty($this->appendOrder))
		{
			$tempArr = array();
			
			for($i=0; $i<sizeof($form); $i++)
			{
				$tempArr[$i] = $form[$this->appendOrder[$i]];
			}
			$form = $tempArr;
		}

		//Remove empty fields that are not required
		for($i=0; $i<sizeof($form); $i++)
		{
			if( empty($form[$i][1]) )
			{
				unset($form[$i]);
			}
		}

		


		//Append all fields
		foreach($form as $arr)
		{
			$this->append($arr[0], $arr[1]);
		}
	}
}
?>
