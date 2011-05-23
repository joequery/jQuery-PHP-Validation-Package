<!doctype html>
<html>
<head>
	<title>Testing Form.js</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
<script src="../../plugins.js"></script>
<script src="../../Form.js"></script>
<script src="Form_test.js"></script>
</head>

<body>
	<div id="main">Testing Form<br /></div>

<fieldset>
	<form id="contact" action="ajax.php" method="post">	
		<label for="name"></label>
		<input type="text" id="name" name="name" />

		<label for="email"></label>
		<input type="text" id="email" name="email" />

		<label for="phone"></label>
		<input type="text" id="phone" name="phone" />

		<label for="message"></label>
		<textarea rows=10 cols=5 name="message"></textarea>
		
		<input type="submit" />

		
	</form>	
</fieldset>
	

</body>


</html>

