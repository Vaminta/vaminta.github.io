// article embed service

let article = new Object();
article.metadata = {
	title: "Article",
	author: "Unknown",
	published: null,
	updated: null
};

article.metadata.generate = function(){
	const titleText = document.getElementsByTagName("title")[0].innerHTML;
	article.metadata.title = titleText;
	const mdContainer = document.getElementById("meta-data-container");
	if(!mdContainer) return;
	
	const authorText = document.getElementById("author-span").innerHTML;
	if(authorText.length>1) article.metadata.author = authorText;
	
	const published = document.getElementById("published-span").innerHTML;
};

function postMetadata(){
	let data = {
		sender: "content-page",
		type: "meta-data",
		value: {
			title: article.metadata.title
		}
	};
	window.parent.postMessage(data,"*");
}

function receiveMessage(event){
	let data = event.data;
}

function initialise(){
	article.metadata.generate();
	postMetadata();
}

var interval = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(interval);
		initialise();
	}
},200);

window.addEventListener("message", receiveMessage, false);