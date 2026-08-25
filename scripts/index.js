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
	let iconCont = document.querySelector("#motd-icon-cont");
	iconCont.getElementsByTagName("img")[0].style.display = "none"; //loading icon
	iconCont.getElementsByTagName("img")[1].style.display = "block";
	console.log(generics);
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
	setTimeout(getMessages, 200);
}

var interval = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(interval);
		initialise();
	}
},250);