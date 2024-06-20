function initialisey(){
	articleManager = new ArticleManager();
	articleManager.fetchArticles()
		.then(()=>{
			genArtHTML(articleManager);
			}
		);
}

function handleArticleClick(el){
	const etsrc = el.getAttribute("data-tsrc");
	if(!etsrc || etsrc.length < 3){ //problemo!
		console.error("Article contained no tsrc data");
		return;
	}
	let params = {
		tsrc: etsrc
	};
	
	aes.loadArticle(params);
}

function genArtHTML(am){
	if(!am) return;
	const articles = am.sortArticles("r-chron-pub");
	
	for(let i=0; i<articles.length; i++){
		//if(!articles[i].visible) continue;
		let articleBox = document.createElement("div");
		articleBox.classList = "article-box ";
		articleBox.dataset.tsrc = articles[i].content_url;
		let innerHTML = '';
		const thumbnail = am.getThumbnail(articles[i]);
		const thumbSrc = "../../" + thumbnail.src;
		innerHTML += '<div class="article-thumb-cont"><img src="' + thumbSrc + '" /></div>';
		innerHTML += '<div class="article-details-cont">';
		
		for(let n=0; n<articles[i].tags.length; n++){
			innerHTML += '<span class="article-tag">' + articles[i].tags[n] + '</span>';
		}
		innerHTML += '<br><span class="article-title">' + articles[i].title + '</span>';
		
		innerHTML += '<br><span class="article-strapline">' + articles[i].strapline + '</span>';
		
		innerHTML += '<br><br><span class="article-pub-date">' + am.dateToString(articles[i].date_published) + '</span><span class="article-author"> - ' + articles[i].author + '</span>';
		
		innerHTML += '</div>'; //close article details cont
		
		articleBox.innerHTML = innerHTML;
		articleBox.onclick = function(){handleArticleClick(this)};
		document.getElementsByClassName("article-container")[0].appendChild(articleBox);
	}
}

var intervall = setInterval(function(){
	if(document.readyState=="complete"){
		clearInterval(intervall);
		//console.log("interval clear");
		initialisey();
	}
},200);