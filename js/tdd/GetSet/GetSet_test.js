$(document).ready(function(){
	
	// Instantiate GetSet class. Treat as static
	var gs = new GetSet();

	// Your every-day object...
	var woohoo= {
		key: "value1",
		key2: "value2"
	}

	/* Create getter methods within the scope of window
	 * for the object members of woohoo 
	 */
	gs.getters({scope: window, obj: woohoo});

	$("#main").append(window.getKey() + "<br />");   //value1
	$("#main").append(window.getKey2() + "<br />");  //value2

	// An empty object that we will populate with setter methods
	var testObj = {}

	/* Create setter methods within the scope of testObj
	 * for the object members of woohoo
	 */
	gs.setters({scope: testObj, obj: woohoo});

	testObj.setKey("New Value 1");
	testObj.setKey2("New Value 2");

	$("#main").append(window.getKey() + "<br />");  // New Value 1
	$("#main").append(window.getKey2() + "<br />"); // New Value 2

});
