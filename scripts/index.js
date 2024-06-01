let messages;

function randomInt(min,max){
	const random = Math.random();
	const difference = max-min+1;
	const result = Math.floor(min+(random*difference));
	return result;
}

function processMOTD(messages){
	const generics = messages.generic;
	const randomIndex = randomInt(0,generics.length-1);
	const chosen = generics[randomIndex];
	document.querySelector("#motd-message-span").innerHTML = chosen.message;
	console.log(generics);
}

function setMinHeight(){
	const headHeight = document.getElementsByTagName("header")[0].offsetHeight;
	const availableHeight = window.innerHeight - headHeight;
	let main = document.getElementsByTagName("main")[0];
	main.style.minHeight = availableHeight-16+"px"; //account for footer (not exact just yet - prob closer to 18px)
}

function getMessages(){
	fetch("data/messages.json").then(function(response){
		return response.json();
	})
	.then(function(json){
		messages = json;
		processMOTD(messages);
	})
	.catch(function(error){
		document.querySelector("#motd-message-span").innerHTML = "Failed to get message :( ";
		console.error("Message of the day error: "+error);
	});
}

function initialise(){
	setMinHeight();
	setTimeout(getMessages, 1000);
}

var interval = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(interval);
		initialise();
	}
},250);