<!doctype html>
<html>
<head>
	<title>Testing Form.js</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
<script src="../../plugins.js"></script>
<script src="../../GetSet.js"></script>
<script src="../../Regex.js"></script>
<script src="../../POST.js"></script>
<script src="../../Form.js"></script>
<script src="Form_test.js"></script>

<style type="text/css">
	.invalid{
		color: #ff0000;
	}
</style>
</head>

<body>
	<div id="main">Testing Form<br /></div>

<fieldset>
	<form id="contact" action="ajax.php" method="post">	
		<label for="name">Name</label>
		<input class="required" type="text" id="name" name="name" />

		<label for="email">Email</label>
		<input class="required" type="text" id="email" name="email" />

		<label for="phone">Phone</label>
		<input class="required" type="text" id="phone" name="phone" />

		<label for="message">Message</label>
		<textarea class="required" rows=10 cols=5 name="message"></textarea>
		
		<input type="submit" />

		
	</form>	
</fieldset>
	

</body>


</html>

