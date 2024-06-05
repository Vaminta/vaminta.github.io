function initialisey(){
	articleManager = new ArticleManager();
	articleManager.fetchArticles()
		.then(()=>{
			console.log(articleManager);
			genArtHTML(articleManager);
			}
		);
}

function handleArticleClick(el){
	console.log(el);
}

function genArtHTML(am){
	if(!am) return;
	const articles = am.getArticles();
	
	for(let i=0; i<articles.length; i++){
		//if(!articles[i].visible) continue;
		let articleBox = document.createElement("div");
		articleBox.classList = "article-box ";
		articleBox.dataset.tsrc = articles[i].content_url;
		let innerHTML = '';
		for(let n=0; n<articles[i].tags.length; n++){
			innerHTML += '<span class="article-tag">' + articles[i].tags[n] + '</span>';
		}
		innerHTML += '<br><span class="article-title">' + articles[i].title + '</span>';
		
		innerHTML += '<br><span class="article-desc">' + articles[i].description + '</span>';
		
		articleBox.innerHTML = innerHTML;
		articleBox.onclick = function(){handleArticleClick(this)};
		document.getElementsByClassName("article-container")[0].appendChild(articleBox);
	}
}

var intervall = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(intervall);
		initialisey();
	}
},200);