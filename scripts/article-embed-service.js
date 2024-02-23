// article embed service

function postMetadata(){
	const titleText = document.getElementsByTagName("title")[0].innerHTML;
	let data = {
		sender: "content-page",
		type: "meta-data",
		value: {
			title: titleText
		}
	};
	window.parent.postMessage(data,"*");
}

function initialise(){
	postMetadata();
}

var interval = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(interval);
		initialise();
	}
},200);