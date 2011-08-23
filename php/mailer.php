<?php
session_start();
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

$test = array("name" => "Joseph McCullough",
	"phone" => "903 330 5057",
	"email" => "Joseph@vertstudios.com",
	"message" => "Testing!");

$mailer = new Mail("joseph@vertstudios.com", $test);
$mailer->setFrom("noreply@vertstudios.com");
$mailer->setSubject("Test Mail");
$ajax = $mailer->hasAJAX();

//Make names to nice looking versions
$mailer->setDesc(array(
	"name" => "Name",
	"phone" => "Phone",
	"email" => "Email",
	"message" => "Message"
));

$mailer->setRequired("name, email, message");

//Message cannot contain html,bbcode, or mailstrings
$mailer->hasNone(array(
	"message" => "html, bbcode, mailstrings"	
));
    
//Set order
$mailer->setOrder("name,phone,email,message");
$mailer->appendAll();

echo $mailer->getBody();
?>
