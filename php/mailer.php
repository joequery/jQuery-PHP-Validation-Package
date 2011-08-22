<?php
session_start();
require_once("../local-config.php");
date_default_timezone_set('America/Chicago');
//------------------------------------------------------------
// File: mail.php
// Purpose: Provide form validation and mailing
// Author: Joseph McCullough (@joe_query) 
// Last Updated: Dec 03, 2010
//------------------------------------------------------------

include('Regex.php');
include('Mail.php');

$status = "invalid";  //Initialize the response to server

$mailer = new Mail("joseph@vertstudios.com", $_POST);
$mailer->setFrom("noreply@vertstudios.com");
$mailer->setSubject("Crowded6 Contact Form");
$ajax = $mailer->hasAJAX();

//Make names to nice looking versions
$nameMap = array(
	"name" => "Name",
	"phone" => "Phone",
	"email" => "Email",
	"message" => "Message"
);

$mailer->setRequired("name, email, message");

//Message cannot contain html,bbcode, or mailstrings
$mailer->hasNone(array(
	"message" => "html, bbcode, mailstrings"	
));
    
//Set order
$mailer->setOrder("name,usphone,email,message");

if($mailer->valid()){
    $mailer->appendAll($nameMap);
	if($mailer->send())	{
		$status = "thanks";
	}
	else{
		$status = "error";
	}
}

//If request was made via AJAX, echo back. If not, redirect.
if($ajax){
	echo $status;
}
else{
	$_SESSION["POST"] = $_POST;
	header("Location: " . ROOTDIR . "contact?status=" . $status);
}
?>
