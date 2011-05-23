var gs = new GetSet();
console.log(gs);

var woohoo={
	key: "value",
	key2: "value2"
}

gs.getters({scope: window, obj: woohoo});
console.log(window.getKey());
