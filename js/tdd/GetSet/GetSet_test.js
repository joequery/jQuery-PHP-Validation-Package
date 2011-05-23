var gs = new GetSet();

var woohoo={
	key: "value1",
	key2: "value2"
}

gs.getters({scope: window, obj: woohoo});
$("#main").append(window.getKey());
$("#main").append(window.getKey2());
