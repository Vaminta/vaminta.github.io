/*

*/

artiframe = null;
receivedContact = false;

function receiveMessage(event){
    const data = event.data;
    if(data.sender=="content-page"){
		receivedContact = true;
		if(data.type=="meta-data"){
			document.getElementsByTagName("title")[0].innerHTML = data.value.title;
		}
	}
}

function iframeLoad(el){
	if(!el.src) return;
	receivedContact = false;
	window.setTimeout(function(){
		if(!receivedContact){
			alert("no contact received!");
		}
	},2000);
	
}

function setIframeHeight(){
	//get height of header
	const headHeight = document.getElementsByTagName("header")[0].offsetHeight;
	const availableHeight = window.innerHeight - headHeight;
	artiframe.style.height = availableHeight-10+"px";
}

function initialise(){
	artiframe = document.getElementById("article-iframe");
	artiframe.onload = function(){iframeLoad(this)};
	setIframeHeight();
	const search = window.location.search;
	if(!search) console.error("no target src");
	else{
		const src = "content/"+search.substr(1)+".html";
		console.log("src: "+src);
		artiframe.src = src;
	}
	window.addEventListener("message", receiveMessage, false);
}

var interval = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(interval);
		initialise();
	}
},200);