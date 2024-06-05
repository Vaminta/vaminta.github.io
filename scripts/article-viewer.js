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
		let ack = {
			sender: "viewer",
			type: "acknowledgement"
		};
		artiframe.contentWindow.postMessage(ack,"*");
	}
}

function setIframeSrc(){
	const search = window.location.search;
	if(!search) console.error("no target src");
	const params = new URLSearchParams(search.substr(1));
	const target = params.get("tsrc"); //target src
	const src = "content/"+target+".html";
	console.log("src: "+src);
	artiframe.src = src;
}

//called by iframe when onLoad fired
function iframeOnload(el){
	//if(!el.src) return;
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
	artiframe.style.height = availableHeight-18+"px"; //account for footer (not exact just yet - prob closer to 18px)
}

function initialise(){
	artiframe = document.getElementById("article-iframe");
	artiframe.onload = function(){iframeOnload(this)};
	setIframeHeight();
	setIframeSrc();
	window.addEventListener("message", receiveMessage, false);
}

var interval = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(interval);
		initialise();
	}
},200);