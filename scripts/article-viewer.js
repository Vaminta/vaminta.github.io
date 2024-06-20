/*

*/

let artViewer = {
	artiframe: null,
	receivedContact: false,
	urlParams:{
		tsrc: "",
		tid: -1
	}
};

function receiveMessage(event){
    const data = event.data;
    if(data.sender=="content-page"){
		artViewer.receivedContact = true;
		if(data.type=="meta-data"){
			document.getElementsByTagName("title")[0].innerHTML = data.value.title;
		}
		if(data.type=="load-article"){
			const tsrc = data.value.tsrc;
			let urlParams = new URLSearchParams(window.location.search.substr(1));
			urlParams.set("tsrc", tsrc);
			window.location.search = urlParams;
			artViewer.init();
			
		}
		let ack = {
			sender: "viewer",
			type: "acknowledgement"
		};
		artViewer.artiframe.contentWindow.postMessage(ack,"*");
		
	}
}

artViewer.getUrlParams = function(){
	const params = new URLSearchParams(window.location.search.substr(1));
	if(!params.has("tsrc")&&!params.has("tid")){
		artViewer.urlParams = {
			tsrc: "index",
			tid: 0 
		};
	}
	if(params.has("tsrc")) artViewer.urlParams.tsrc = params.get("tsrc");
	if(params.has("tid")) artViewer.urlParams.tid = params.get("tid");
};

artViewer.setIframeSrc = function(){
	//const search = window.location.search;
	//if(!search) console.error("no target src");
	const tsrc = artViewer.urlParams.tsrc;
	if(tsrc.length>0){
		const src = "content/"+tsrc+".html";
		artViewer.artiframe.src = src;
	}
};

//called by iframe when onLoad fired
function iframeOnload(el){
	//if(!el.src) return;
	artViewer.receivedContact = false;
	window.setTimeout(function(){
		if(!artViewer.receivedContact){
			//alert("no contact received!");
			window.location.href = window.location.origin + window.location.pathname;
		}
	},2000);
	
}

function setIframeHeight(){
	//get height of header
	const headHeight = document.getElementsByTagName("header")[0].offsetHeight;
	const availableHeight = window.innerHeight - headHeight;
	artViewer.artiframe.style.height = availableHeight-18+"px"; //account for footer (not exact just yet - prob closer to 18px)
}

artViewer.init = function(){
	artViewer.artiframe = document.getElementById("article-iframe");
	artViewer.artiframe.onload = function(){iframeOnload(this)};
	setIframeHeight();
	artViewer.getUrlParams();
	artViewer.setIframeSrc();
	window.addEventListener("message", receiveMessage, false);
}

window.addEventListener('load', function() {
    artViewer.init();
});

/*
var interval = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(interval);
		initialise();
	}
},200);*/