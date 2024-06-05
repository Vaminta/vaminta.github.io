// article embed service

let aes = {
	acknowledgeCount: 0
};

const pageType= {
	article: "article",
	system: "system"
};

let article = new Object();
article.metadata = {
	type: pageType.article,
	title: "Article",
	author: "Unknown",
	published: null,
	updated: null
};

article.generateMetadata = function(metadata){
	const titleText = document.getElementsByTagName("title")[0].innerHTML;
	metadata.title = titleText;
	const mdContainer = document.getElementById("meta-data-container");
	if(!mdContainer) return;
	
	const authorText = document.getElementById("author-span").innerHTML;
	if(authorText.length>1) metadata.author = authorText;
	
	const published = document.getElementById("published-span").innerHTML;
};

aes.postMetadata = function(){
	let data = {
		sender: "content-page",
		type: "meta-data",
		value: article.metadata
	};
	window.parent.postMessage(data,"*");
};



aes._checkAck = function(){
	if(aes.acknowledgeCount>0) return;
	const params = new URLSearchParams(window.location.toString().substr(1));
	const redir = params.get("redir");
	
	const path = window.location.pathname;
	const indicator = "content/";
	const position = path.indexOf(indicator)+indicator.length;
	let file = path.substr(position);
	if(file.length<1) file = "index.html";
	const tsrc = file.substring(0, file.indexOf("."));
	
	const newPath = "/vaminta/articles/viewer.html?tsrc="+tsrc;
	const origin = window.location.origin;
	window.location.href = origin+newPath;
};

function receiveMessage(event){
	let data = event.data;
	if(data.sender && data.sender == "viewer"){
		aes.acknowledgeCount++;
	}
}

aes.initialise = function(){
	article.generateMetadata(article.metadata);
	aes.postMetadata();
	window.setTimeout(aes._checkAck,1000);
};

window.addEventListener('load', function() {
    aes.initialise();
});

window.addEventListener("message", receiveMessage, false);